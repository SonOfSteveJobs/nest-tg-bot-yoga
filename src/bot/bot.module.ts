import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './bot-config.factory';

@Module({
  imports: [TelegrafModule.forRootAsync(options())],
  providers: [BotService],
  controllers: [BotController]
})
export class BotModule { }
