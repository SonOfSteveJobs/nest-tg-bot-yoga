import { ParseMode, ReplyKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export type KeyboardType = 'keyboard' | 'inline_keyboard';

export interface KeyboardOption {
    text: string;
    callback_data?: string;
}

export interface KeyboardOptions {
    reply_markup: ReplyKeyboardMarkup,
    parse_mode: ParseMode,
    caption?: string
}

export const getKeyboardOptions = (
    keyboardType: KeyboardType,
    keyboardOptions: KeyboardOption[][],
    caption?: string,
    oneTime?: boolean,
) => {
    return {
        reply_markup: JSON.stringify({
            one_time_keyboard: oneTime || false,
            resize_keyboard: true,
            [keyboardType]: keyboardOptions,
        }),
        parse_mode: "MarkdownV2",
        caption,
    };
}