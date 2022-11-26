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
const config_1 = require("../config");
const guild_1 = __importDefault(require("../controller/guild"));
const formatCharactersEmbed = (characters) => {
    const charactersFields = [];
    characters.forEach((character) => {
        charactersFields.push({
            name: `Name: ${character.username}`,
            value: `Message: ${character.content}`
        });
    });
    if (characters.length === 0) {
        charactersFields.push({
            name: 'Not Found',
            value: 'There Are No Characers in This Server',
            inline: true
        });
    }
    const embed = {
        title: 'Characters',
        description: 'All Characters in this server',
        fields: charactersFields,
        color: config_1.embedsColor
    };
    return embed;
};
const formatASingalCharacterEmbed = (character) => {
    const embed = {
        title: `${character.username}`,
        description: `${character.content}`,
        color: config_1.embedsColor
    };
    if (character.avatarURL) {
        embed.thumbnail = {
            url: `${character.avatarURL}`
        };
    }
    return embed;
};
const findAllCharacters = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const characters = yield guild_1.default.retriveAllCharacters(interaction.guildID);
    const embed = formatCharactersEmbed(characters);
    return yield interaction.createMessage({ embeds: [embed] });
});
const addCharacter = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const characterName = interaction.data.options[0].options[0].value;
    const characterMessage = interaction.data.options[0].options[1].value;
    // optinal value
    const characterAvatarUrl = (interaction.data.options[0].options[2]) ? interaction.data.options[0].options[2].value : "";
    const characters = yield guild_1.default.pushCharacter(interaction.guildID, {
        username: characterName,
        content: characterMessage,
        avatarURL: characterAvatarUrl
    });
    const embed = formatCharactersEmbed(characters);
    return yield interaction.createMessage({
        embeds: [embed]
    });
});
const editCharacter = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(getOption((interaction.data as any).options[0].options, "name"), getOption((interaction.data as any).options[0].options, "message"), getOption((interaction.data as any).options[0].options, "avatar"))
    const targetCharacter = interaction.data.options[0].options[0].value;
    // optinal value
    const characterName = getOption(interaction.data.options[0].options, "name") ? getOption(interaction.data.options[0].options, "name").value : "";
    // optinal value
    const characterMessage = getOption(interaction.data.options[0].options, "message") ? getOption(interaction.data.options[0].options, "message").value : "";
    // optinal value
    const characterAvatarUrl = getOption(interaction.data.options[0].options, "avatar") ? getOption(interaction.data.options[0].options, "avatar").value : "";
    const character = yield guild_1.default.editCharacter(interaction.guildID, targetCharacter, {
        username: characterName,
        content: characterMessage,
        avatarURL: characterAvatarUrl
    });
    const embed = formatASingalCharacterEmbed(character);
    return yield interaction.createMessage({
        embeds: [embed]
    });
});
const infoCharacter = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const characterName = interaction.data.options[0].options[0].value;
    const character = yield guild_1.default.getCharacter(interaction.guildID, characterName);
    const infoEmbed = formatASingalCharacterEmbed(character);
    return yield interaction.createMessage({
        embeds: [infoEmbed]
    });
});
const deleteCharacter = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const characterName = interaction.data.options[0].options[0].value;
    const characters = yield guild_1.default.deleteCharacter(interaction.guildID, characterName);
    const embed = formatCharactersEmbed(characters);
    return yield interaction.createMessage({ embeds: [embed] });
});
const setChannel = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const channelID = interaction.data.options[0].options[0].value;
    if ((channelID).length > 50 || isNaN(channelID)) {
        throw Error('please enter a valid channel id');
    }
    yield guild_1.default.setWebhookChannel(interaction.guildID, channelID);
    return interaction.createMessage({ embeds: [{
                title: 'New Welcoming channel',
                description: `<#${channelID}>`
            }]
    });
});
const helpCommand = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    interaction.createMessage({ content: `Having **issues or questions about OurBot!!** \n\nWe will do our best to help you <3! \nThe offical support server: \nhttps://discord.gg/BqHQSf65b2
    `, flags: 64 });
});
function getOption(options, name) {
    return options.find((option) => option.name === name);
}
exports.default = {
    findAllCharacters,
    addCharacter,
    editCharacter,
    infoCharacter,
    deleteCharacter,
    setChannel,
    helpCommand
};
