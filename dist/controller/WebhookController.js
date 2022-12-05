"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomMessage = void 0;
const Character_1 = require("./Character");
const pickRandomCharacter = (characters) => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
};
const createWbhook = (bot, channelId, webhookName) => __awaiter(void 0, void 0, void 0, function* () {
    const webhook = yield bot.createChannelWebhook(channelId, {
        name: webhookName,
        avatar: ''
    });
    return webhook;
});
const retriveWelcomerWebhook = (guildWebhooks, bot, channelId, webhookDefualtName) => __awaiter(void 0, void 0, void 0, function* () {
    const thereAreNoWebhooks = guildWebhooks.length === 0;
    if (thereAreNoWebhooks)
        return yield createWbhook(bot, channelId, webhookDefualtName);
    const guildDefaultWebhookIndex = guildWebhooks.findIndex((guildWebhook) => {
        return guildWebhook.name === webhookDefualtName;
    });
    const doesGuildDefaultWebhookExist = (guildDefaultWebhookIndex !== -1);
    if (!doesGuildDefaultWebhookExist)
        return yield createWbhook(bot, channelId, webhookDefualtName);
    const guildDefaultWebhook = guildWebhooks[guildDefaultWebhookIndex];
    const defualtChannelHasBeenChanged = guildDefaultWebhook.channel_id !== channelId;
    if (defualtChannelHasBeenChanged) {
        yield bot.editWebhook(guildDefaultWebhook.id, {
            channelID: channelId
        });
    }
    return guildDefaultWebhook;
});
const sendWelcomMessage = (bot, characters, guildId, channelId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const characterObjects = [];
    characters.forEach(character => {
        characterObjects.push(new Character_1.Character(character.username, character.avatarURL, character.content));
    });
    const finalCharacter = pickRandomCharacter(characterObjects);
    // send to the webhook channel
    try {
        const guild = bot.guilds.get(guildId);
        const guildWebhooks = (yield guild.getWebhooks()).filter(webhook => {
            var _a;
            return ((_a = webhook.user) === null || _a === void 0 ? void 0 : _a.id) === bot.user.id;
        });
        const webhook = yield retriveWelcomerWebhook(guildWebhooks, bot, channelId, 'welcomer');
        yield bot.executeWebhook(webhook.id, webhook.token, Object.assign({}, finalCharacter.getWebhookObject(userId)));
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.sendWelcomMessage = sendWelcomMessage;
