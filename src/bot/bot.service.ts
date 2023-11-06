import { Ctx, Start, Update, On, Hears } from "nestjs-telegraf";
import { Markup, Scenes, Telegraf, } from "telegraf";
import { getKeyboardOptions } from './lib/create-keyboard';
import { PrismaService } from "@/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
const path = require('path');

type Context = Scenes.SceneContext

@Update()
export class BotService extends Telegraf<Context> {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
    ) {
        super(config.get('BOT_TOKEN'));
    }

    private waitingForAdminMessage = false;
    @Start()
    async onStart(@Ctx() ctx: Context) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: ctx.from.username
            }
        });

        if (!user) {
            const user = await this.prisma.user.create({
                data: {
                    username: ctx.from.username,
                    first_name: ctx.from.first_name,
                    last_name: ctx.from?.last_name || null,
                    chat_id: ctx.update?.["message"].chat.id
                }
            });
        }

        const options = getKeyboardOptions(
            'keyboard',
            [[{ text: 'Вариант 1' }], [{ text: 'Вариант 2' }], [{ text: 'Вариант 3' }], [{ text: 'Вариант 4' }]]
        )

        await ctx.replyWithMarkdownV2(
            `Welcome, ${ctx.from.first_name}\\. Тут всякие штуки про йогу\\.`,
            //@ts-ignore
            options
        )

        if (user.is_admin) {
            const options = getKeyboardOptions(
                'inline_keyboard',
                [[{ text: 'Отправить сообщение всем юзерам', callback_data: 'admin_send_hi' }]]
            )

            await ctx.replyWithMarkdownV2(
                'Управление ботом',
                //@ts-ignore
                options
            )
        }
    }

    @On('callback_query')
    async onCallback(@Ctx() ctx: Context) {
        const data = ctx.callbackQuery?.['data'];

        switch (data) {
            // case 'option1':
            //     ctx.reply('Вы выбрали Вариант 1');
            //     break;
            // case 'option2':
            //     ctx.reply('Вы выбрали Вариант 2');
            //     break;
            // case 'option3':
            //     ctx.reply('Вы выбрали Вариант 3');
            //     break;
            // case 'option4':
            //     ctx.reply('Вы выбрали Вариант 4');
            //     break;
            case 'admin_send_hi':
                await ctx.reply('Введите текст сообщения (или отправьте /cancel для отмены):');
                this.waitingForAdminMessage = true;
                break;
            default:
                ctx.reply('Неизвестная опция');
        }
    }

    @Hears('Вариант 1')
    async onOption1(@Ctx() ctx: Context) {
        await ctx.reply('Вы выбрали Вариант 1');
    }

    @Hears('Вариант 2')
    async onOption2(@Ctx() ctx: Context) {
        const video = path.join(__dirname, '..', '..', 'assets', '2.MOV');
        const fileId = await ctx.replyWithVideo({ source: video });
        console.log(fileId);
    }

    @Hears('Вариант 3')
    async onOption3(@Ctx() ctx: Context) {
        try {
            // const video = path.join(__dirname, '..', '..', 'assets', 'Медитация расслабления.MP3');
            // const fileId = await ctx.replyWithAudio({ source: video });
            // console.log(fileId);
            await ctx.replyWithAudio("CQACAgIAAxkDAAIBQmVE-21rVmkOxwML-HfkGVj45-EtAAJAOwACU3woSqLD69_B0-LAMwQ", {
                caption: "Королевская медитация, для тех кто хочет: \n -Отпустить тревогу \n -Наполниться королевской энергией \n -Абстрагироваться от проблем \n -Проживать момент «здесь и сейчас» \n \nПусть каждый день будет наполнен королевской энергией💕"
            });
        } catch (error) {
            console.error('Ошибка при отправке аудио:', error);
            await ctx.reply('Произошла ошибка при отправке аудиофайла.');
        }
    }

    @Hears('Вариант 4')
    async onOption4(@Ctx() ctx: Context) {
        await ctx.reply('Вы выбрали Вариант 4');
    }

    @Hears(/.+/)
    async onMessage(@Ctx() ctx: Context) {
        //@ts-ignore
        const text = ctx.message.text;

        const user = await this.prisma.user.findUnique({
            where: {
                username: ctx.from.username
            }
        });

        if (this.waitingForAdminMessage && user.is_admin) {
            if (text === '/cancel') {
                this.waitingForAdminMessage = false;
                await ctx.reply('Отправка сообщения отменена.');
                return;
            }

            const users = await this.prisma.user.findMany({
                where: {
                    has_blocked_bot: false
                }
            });

            for (const user of users) {
                try {
                    await this.telegram.sendMessage(user.chat_id, text);
                } catch (error) {
                    await this.prisma.user.update({
                        where: {
                            username: user.username
                        },
                        data: {
                            has_blocked_bot: true
                        }
                    })
                }
            }

            this.waitingForAdminMessage = false;
            await ctx.reply('Сообщение отправлено.');
            return;
        }
    }
}
