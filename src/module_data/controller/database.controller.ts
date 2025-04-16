import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { memoryStorage } from 'multer';
import { DatabaseServiceInterface } from '../service/database.service.interface';


@Controller('database')
export class DatabaseController {

    constructor(
        @Inject("DatabaseServiceInterface")
        private readonly databaseService: DatabaseServiceInterface
    ) { }


    @Post('new')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(xlsx|xls)$/)) {
                    return cb(new BadRequestException('Only Excel files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async importProducts(@UploadedFile() file: Express.Multer.File): Promise<any> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        return this.databaseService.createDatabase(file.buffer);

    }

}	    