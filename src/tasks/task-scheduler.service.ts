import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskService } from './task.service';

@Injectable()
export class TaskSchedulerService {
    private readonly logger = new Logger(TaskSchedulerService.name);

    constructor(private readonly taskService: TaskService) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        this.logger.log('Checking for tasks to execute...');
        await this.taskService.executeTasks();
    }
}