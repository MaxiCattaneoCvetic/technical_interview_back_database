import { Controller, Post, Body, BadRequestException, Inject, HttpException, HttpStatus, Res } from '@nestjs/common';
import { DatabaseServiceInterface } from '../service/database.service.interface';
import { Response } from 'express';

interface FileUploadDto {
    fileName: string;
    fileContent: string;
}

@Controller('database')
export class DatabaseController {
    constructor(
        @Inject("DatabaseServiceInterface")
        private readonly databaseService: DatabaseServiceInterface
    ) { }

    @Post('new')
    async importProducts(@Body() fileData: FileUploadDto, @Res() res: Response): Promise<any> {
        try {
            console.log('Received file:', {
                fileName: fileData.fileName,
                contentLength: fileData.fileContent.length
            });

            if (!fileData.fileName || !fileData.fileContent) {
                throw new BadRequestException('File data is missing');
            }

            if (!fileData.fileName.match(/\.(xlsx|xls)$/)) {
                throw new BadRequestException('Only Excel files are allowed!');
            }

            // Convertir base64 a buffer
            const base64Data = fileData.fileContent.replace(/^data:application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            if (buffer.length === 0) {
                throw new BadRequestException('File is empty');
            }

            const result = await this.databaseService.createDatabase(buffer);
            return res.status(HttpStatus.CREATED).json(result);
        } catch (error) {
            console.error('Error processing file:', error);
            if (error instanceof BadRequestException) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: error.message,
                    error: 'Bad Request',
                    statusCode: HttpStatus.BAD_REQUEST
                });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error processing the file',
                error: 'Internal Server Error',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            });
        }
    }
}	    