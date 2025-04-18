import { Controller, Get, Inject, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

import { DatabaseServiceInterface } from '../service/database.service.interface';
import { AuthGuard } from 'src/shared/auth/auth.guard';

@Controller('init')
@UseGuards(AuthGuard)
export class InitController {
    constructor(
        @Inject('DatabaseServiceInterface')
        private readonly databaseService: DatabaseServiceInterface,
        private readonly configService: ConfigService
    ) { }

    @Get('database')
    async initializeDatabase() {
        try {
            const excelPath = this.configService.get<string>('EXCEL_FILE_PATH');
            if (!excelPath) {
                throw new HttpException({
                    success: false,
                    message: 'Excel file path not configured'
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const absolutePath = path.join(process.cwd(), excelPath);
            const fileBuffer = fs.readFileSync(absolutePath);

            const result = await this.databaseService.createDatabase(fileBuffer);
            return {
                success: true,
                message: 'Database initialized successfully',
                data: result
            };
        } catch (error) {
            throw new HttpException({
                success: false,
                message: 'Error initializing database',
                error: error.message
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 