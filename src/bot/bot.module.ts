import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './bot-config.factory';

@Module({
  imports: [TelegrafModule.forRootAsync(options())],
  providers: [BotService],
})
export class BotModule { }
