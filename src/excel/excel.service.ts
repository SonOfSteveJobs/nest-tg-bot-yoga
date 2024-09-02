import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { Task } from '@/tasks/task.type';

const prisma = new PrismaClient();

export class TaskExcelService {
    static async importTasksFromExcel(filePath: string) {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const tasks = XLSX.utils.sheet_to_json(sheet);

        for (const task of tasks) {
            const { description, date, time, imageUrl, productUrl, title } = task as Task;

            const taskDate = this.convertExcelDateTime(date as unknown as number, time as unknown as number);

            await prisma.task.create({
                data: {
                    description,
                    date: taskDate,
                    title,
                    imageUrl,
                    productUrl,
                },
            });
        }

        console.log('Tasks imported successfully');
    }

    static convertExcelDateTime(excelDate: number, excelTime: number): Date {
        // Excel считает дни с 1 января 1900 года (начальная точка)
        const epoch = new Date(Date.UTC(1900, 0, 1)); // Используем UTC для точности
        const taskDate = new Date(epoch.getTime() + (excelDate - 2) * 24 * 60 * 60 * 1000); // -2 из-за баги в Excel

        // Добавление времени, переводя дробное значение в миллисекунды
        const millisecondsInDay = 24 * 60 * 60 * 1000;
        const taskTime = excelTime * millisecondsInDay;

        // Создаем новую дату с учетом времени
        const finalDate = new Date(taskDate.getTime() + taskTime);

        return finalDate;
    }
}