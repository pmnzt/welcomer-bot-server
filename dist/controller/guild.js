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
const Guild_1 = __importDefault(require("../models/Guild"));
const findGuild = (guildId, options = { addGuildIfNotExist: false }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (options.addGuildIfNotExist) {
        return (_a = yield Guild_1.default.findOne({ guildId: guildId })) !== null && _a !== void 0 ? _a : yield addGuild(guildId);
    }
    else {
        return yield Guild_1.default.findOne({ guildId: guildId });
    }
});
const getCharacters = (guild) => {
    if (!guild)
        return [];
    if (!guild.channelId) {
        throw Error(`Please set the welcoming channel using \`/welcomer channel\``);
    }
    const characters = guild.characters;
    if (!characters) {
        return [];
    }
    return characters;
};
const retriveAllCharacters = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = yield findGuild(guildId, { addGuildIfNotExist: false });
    const characters = getCharacters(guild);
    return characters;
});
const getCharacter = (guildId, characterName) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = yield findGuild(guildId);
    if (!guild)
        throw Error('this character doesnt exist!');
    const characters = getCharacters(guild);
    const characterIndex = findCharacterIndex(characters, characterName);
    if (characterIndex === -1)
        throw Error('this character doesnt exist');
    return characters[characterIndex];
});
const deleteCharacter = (guildId, characterName) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = yield findGuild(guildId);
    if (!guild)
        throw Error('this character doesnt exist!');
    const characters = getCharacters(guild);
    const characterIndex = findCharacterIndex(characters, characterName);
    if (characterIndex === -1)
        throw Error('this character doesnt exist');
    characters.splice(characterIndex, 1);
    guild.characters = characters;
    guild.markModified('characters');
    yield guild.save();
    return characters;
});
const editCharacter = (guildId, characterName, character) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = yield findGuild(guildId);
    if (!guild)
        throw Error('this character doesnt exist!');
    const characters = getCharacters(guild);
    const characterIndex = findCharacterIndex(characters, characterName);
    if (characterIndex === -1)
        throw Error('this character doesnt exist');
    if (character.username) {
        if ((character.username).length > 80) {
            throw Error('characters names could not be longer than 80 char');
        }
        characters[characterIndex].username = character.username;
    }
    if (character.content) {
        if ((character.content).length > 100) {
            throw Error('message content could not be longer than 100 char');
        }
        characters[characterIndex].content = character.content;
    }
    if (character.avatarURL) {
        if (!validateUrl(character.avatarURL)) {
            throw Error('provide a valid url for avatar');
        }
        characters[characterIndex].avatarURL = character.avatarURL;
    }
    guild.characters = characters;
    guild.markModified('characters');
    yield guild.save();
    return characters[characterIndex];
});
const setWebhookChannel = (guildId, channelId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!guildId || !channelId)
        throw Error('guildId or channelId is missing');
    const guild = yield findGuild(guildId, { addGuildIfNotExist: true });
    guild.channelId = channelId;
    yield guild.save();
    return guild;
});
const addGuild = (guildId) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = new Guild_1.default({
        guildId: guildId
    });
    yield guild.save();
    return guild;
});
const pushCharacter = (guildId, character) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = yield findGuild(guildId, { addGuildIfNotExist: true });
    const characters = getCharacters(guild);
    if (characters.length > 4)
        throw Error('this guild reached out the max amount of characters');
    const characterIndex = findCharacterIndex(characters, character.username);
    const existedCharacter = (characterIndex !== -1);
    if (existedCharacter)
        throw Error('this Character exists already');
    if (!character.username || !character.content) {
        throw Error('please provide a name and a content message');
    }
    if ((character.content).length > 100) {
        throw Error('message content could not be longer than 100 char');
    }
    if ((character.username).length > 80) {
        throw Error('characters names could not be longer than 80 char');
    }
    if (character.avatarURL) {
        if (!validateUrl(character.avatarURL)) {
            throw Error('provide a valid url for avatar');
        }
    }
    characters.push(character);
    guild.characters = characters;
    guild.markModified('characters');
    yield guild.save();
    return characters;
});
function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}
function compareNames(first, second) {
    if (!first || !second)
        return false;
    if (first.toLocaleLowerCase() === second.toLocaleLowerCase()) {
        return true;
    }
    else {
        return false;
    }
}
function findCharacterIndex(characters, characterName) {
    const index = characters.findIndex((item) => {
        return compareNames(item.username, characterName);
    });
    return index;
}
exports.default = {
    retriveAllCharacters,
    getCharacter,
    pushCharacter,
    editCharacter,
    findGuild,
    setWebhookChannel,
    deleteCharacter
};
