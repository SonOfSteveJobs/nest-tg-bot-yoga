import { Ctx, Start, Update } from "nestjs-telegraf";
import { Scenes, Telegraf } from "telegraf";

type Context = Scenes.SceneContext

@Update()
export class BotService extends Telegraf<Context> {
    @Start()
    onStart(@Ctx() ctx: Context) {
        ctx.reply(`Welcome, ${ctx.from.first_name}. Тут всякие штуки про йогу.`)
    }
}
