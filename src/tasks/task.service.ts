import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}

    async getTasksToExecute(): Promise<any[]> {
        const now = new Date();
        const nowUtc = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

        return this.prisma.task.findMany({
            where: {
                date: {
                    lte: nowUtc, // Получаем все задачи, дата которых <= текущей
                },
            },
            orderBy: {
                date: 'asc',
            },
        });
    }

    async deleteTask(taskId: number): Promise<void> {
        await this.prisma.task.delete({
            where: {
                id: taskId,
            },
        });
    }

    async executeTasks(): Promise<void> {
        const tasks = await this.getTasksToExecute();

        if (tasks.length > 0) {
            for (const task of tasks) {
                console.log(`Executing task with description: ${task.description}`);
                // Здесь выполняйте нужное действие для каждой задачи
                await this.deleteTask(task.id);
            }
        } else {
            console.log('No tasks to execute.');
        }
    }
}