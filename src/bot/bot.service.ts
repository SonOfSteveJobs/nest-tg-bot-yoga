import { Ctx, Start, Update, On } from "nestjs-telegraf";
import { Markup, Scenes, Telegraf, } from "telegraf";
import { getKeyboardOptions } from './lib/create-keyboard';

type Context = Scenes.SceneContext

@Update()
export class BotService extends Telegraf<Context> {
    @Start()
    async onStart(@Ctx() ctx: Context) {
        const options = getKeyboardOptions(
            'keyboard',
            [[{ text: 'Вариант 1' }], [{ text: 'Вариант 2' }]]
        )
        await ctx.replyWithMarkdownV2(
            //@ts-ignore
            `Welcome, ${ctx.from.first_name}\\. Тут всякие штуки про йогу\\.`, options
        )
    }

    @On('callback_query')
    async onCallback(@Ctx() ctx: Context) {
        const data = ctx.callbackQuery?.['data'];

        switch (data) {
            case 'option1':
                ctx.reply('Вы выбрали Вариант 1');
                break;
            case 'option2':
                ctx.reply('Вы выбрали Вариант 2');
                break;
            case 'option3':
                ctx.reply('Вы выбрали Вариант 3');
                break;
            case 'option4':
                ctx.reply('Вы выбрали Вариант 4');
                break;
            default:
                ctx.reply('Неизвестная опция');
        }
    }
}
