import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TaskSchedulerService } from './tasks/task-scheduler.service';
import { TaskService } from './tasks/task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskExcelService } from './excel/excel.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [TaskExcelService, TaskService, TaskSchedulerService],
})
export class AppModule {}
