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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const eris_1 = __importDefault(require("eris"));
const eris_2 = require("eris");
const WebhookController_1 = require("./controller/WebhookController");
const bot = new eris_1.default(config_1.token, {
    intents: [eris_2.Constants.Intents.guildMembers, eris_2.Constants.Intents.allNonPrivileged]
});
bot.on('ready', () => {
    console.log(`${bot.user.username} is ready!`);
    bot.editStatus({ name: "greeting new members", type: 0 });
});
bot.on('guildMemberAdd', (guild, member) => __awaiter(void 0, void 0, void 0, function* () {
    guild_2.default.findGuild(guild.id, { addGuildIfNotExist: false }).then((db) => {
        if (!db)
            return;
        if (!db.channelId || !db.characters.length)
            return;
        (0, WebhookController_1.sendWelcomMessage)(bot, db.characters, guild.id, db.channelId, member.user.id);
    }).catch((err) => { });
}));
process.on("unhandledRejection", (error) => {
    console.log('unhandledRejection');
});
bot.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (interaction.type !== 2)
        return;
    if (!interaction.data)
        return;
    // public commands
    try {
        switch (interaction.data.options[0].name) {
            case "help":
                yield interactionCommands_1.default.helpCommand(interaction);
                break;
        }
    }
    catch (error) {
        console.log('public command error use');
    }
    // Admin commands
    try {
        if (!((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions.has("manageWebhooks"))) {
            throw Error('you must have MANAGE_WEBHOOK permission to use this command');
        }
        switch (interaction.data.options[0].name) {
            case "all":
                yield interactionCommands_1.default.findAllCharacters(interaction);
                break;
            case "add":
                yield interactionCommands_1.default.addCharacter(interaction);
                break;
            case "edit":
                yield interactionCommands_1.default.editCharacter(interaction);
                break;
            case "info":
                yield interactionCommands_1.default.infoCharacter(interaction);
                break;
            case "delete":
                yield interactionCommands_1.default.deleteCharacter(interaction);
                break;
            case "channel":
                yield interactionCommands_1.default.setChannel(interaction);
                break;
        }
    }
    catch (err) {
        interaction.createMessage({ content: `Error: ${err.message}`, flags: 64 });
    }
}));
bot.connect();
mongoose_1.default.connect(config_1.dbURI, () => {
    console.log('db conncted');
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const guild_1 = __importDefault(require("./routes/guild"));
const guild_2 = __importDefault(require("./controller/guild"));
const interactionCommands_1 = __importDefault(require("./commands/interactionCommands"));
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});
app.use('/guild', guild_1.default);
app.listen(config_1.port, () => {
    console.log(`server running on ${config_1.port}`);
});
