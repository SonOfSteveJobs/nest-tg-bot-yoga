import { Ctx, Start, Update, On } from "nestjs-telegraf";
import { Markup, Scenes, Telegraf, } from "telegraf";

type Context = Scenes.SceneContext

@Update()
export class BotService extends Telegraf<Context> {
    @Start()
    async onStart(@Ctx() ctx: Context) {
        await ctx.reply(
            `Welcome, ${ctx.from.first_name}. Тут всякие штуки про йогу.`,
            Markup.inlineKeyboard([
                Markup.button.callback('Вариант 1', 'option1'),
                Markup.button.callback('Вариант 2', 'option2'),
                Markup.button.callback('Вариант 3', 'option3'),
                Markup.button.callback('Вариант 4', 'option4')
            ])
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
