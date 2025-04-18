import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';



import { DatabaseServiceInterface } from './database.service.interface';
import { Product } from '../models/product.entity';
import { ImportResult } from '../models/dto/import-response';





export class DatabaseService implements DatabaseServiceInterface {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) { }


    async createDatabase(buffer: Buffer): Promise<ImportResult> {
        {
            try {
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(buffer);

                const worksheet = workbook.getWorksheet(1);
                if (!worksheet) {
                    throw new Error('Worksheet not found');
                }

                const products: Partial<Product>[] = [];
                let rowCount = 0;

                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber > 1) {
                        try {
                            const product = {
                                code: row.getCell(1).value as string,
                                type: row.getCell(2).value as string,
                                size: row.getCell(3).value as string,
                                color: row.getCell(4).value as string,
                                availableQuantity: parseInt(row.getCell(5).value as string),
                                price50: parseFloat(row.getCell(6).value as string),
                                price100: parseFloat(row.getCell(7).value as string),
                                price200: parseFloat(row.getCell(8).value as string),
                                isAvailable: (row.getCell(9).value as string).toLowerCase() === 'sí',
                                category: row.getCell(10).value as string,
                                description: row.getCell(11).value as string,
                            };
                            products.push(product);
                            rowCount++;
                        } catch (error) {
                            console.error(`Error processing row ${rowNumber}:`, error);
                        }
                    }
                });

                await this.productRepository.save(products);

                return {
                    message: `Successfully imported ${products.length} products`,
                    totalProcessed: rowCount,
                    totalImported: products.length,
                };
            } catch (error) {
                throw new Error(`Error importing products: ${error.message}`);
            }
        }

    }
}
