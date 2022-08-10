import Guild from '../models/Guild'
import { CharacterObject } from './Character'

const findGuild = async (guildId: string, options: getGuildOptions = { addGuildIfNotExist: false }) => {
    if(options.addGuildIfNotExist) {
       return await Guild.findOne({ guildId: guildId })
        ?? await addGuild(guildId)
    } else {
       return await Guild.findOne({ guildId: guildId })
    }
}

const getCharacters = (guild: any) => {
    if(!guild) return []
    if(!guild.channelId) {
        throw Error(`Please set the welcoming channel using \`/welcomer channel\``)
    }
    const characters = guild.characters
    if(!characters) {
        return []
    }

    return characters
}

const retriveAllCharacters = async (guildId: string) => {
    const guild = await findGuild(guildId, {addGuildIfNotExist: false})
    
    const characters = getCharacters(guild)
    return characters
}

const getCharacter = async (guildId: string, characterName: string) => {
    const guild = await findGuild(guildId)
    if(!guild) throw Error('this character doesnt exist!');

    const characters = getCharacters(guild)
    const characterIndex = findCharacterIndex(characters, characterName)

    if(characterIndex === -1) throw Error('this character doesnt exist');

    return characters[characterIndex]
}

const deleteCharacter = async (guildId: string, characterName: string) => {
    const guild = await findGuild(guildId)
    if(!guild) throw Error('this character doesnt exist!');

    const characters = getCharacters(guild)
    const characterIndex = findCharacterIndex(characters, characterName)

    if(characterIndex === -1) throw Error('this character doesnt exist');

    characters.splice(characterIndex, 1)
    guild.characters = characters
    guild.markModified('characters')

    await guild.save() 
    return characters
}

const editCharacter = async (guildId: string, characterName: string, character: CharacterObject) => {
    const guild = await findGuild(guildId)
    if(!guild) throw Error('this character doesnt exist!');

    const characters = getCharacters(guild)
    const characterIndex = findCharacterIndex(characters, characterName)

    if(characterIndex === -1) throw Error('this character doesnt exist');
    
    if(character.username) {
        if((character.username).length > 80) {
            throw Error('characters names could not be longer than 80 char')
        }
        characters[characterIndex].username = character.username
    }

    if(character.content) {
        if((character.content).length > 100) {
            throw Error('message content could not be longer than 100 char')
        }
        characters[characterIndex].content = character.content
    }

    if(character.avatarURL) {
        if(!validateUrl(character.avatarURL)) {
            throw Error('provide a valid url for avatar')
        }
        characters[characterIndex].avatarURL = character.avatarURL
    }

    guild.characters = characters
    guild.markModified('characters')
    await guild.save() 
    return characters[characterIndex]
}

const setWebhookChannel = async (guildId: string, channelId: string) => {
    if(!guildId || !channelId) throw Error('guildId or channelId is missing')
    
    const guild = await findGuild(guildId, { addGuildIfNotExist: true })

    guild.channelId = channelId
    await guild.save()

    return guild
}

const addGuild = async (guildId: string) => {
    const guild = new Guild({
        guildId: guildId
    })

    await guild.save()
    return guild
}

type getGuildOptions = {
    addGuildIfNotExist: Boolean
}

const pushCharacter = async (guildId: string, character: CharacterObject) => {
    const guild = await findGuild(guildId, { addGuildIfNotExist: true })

    const characters = getCharacters(guild)
    if(characters.length > 4) throw Error('this guild reached out the max amount of characters')

    const characterIndex = findCharacterIndex(characters, character.username)

    const existedCharacter = (characterIndex !== -1)
    if(existedCharacter) throw Error('this Character exists already')

    if(!character.username || !character.content) {
        throw Error('please provide a name and a content message')
    }

    if((character.content).length > 100) {
        throw Error('message content could not be longer than 100 char')
    }

    if((character.username).length > 80) {
        throw Error('characters names could not be longer than 80 char')
    }

    if(character.avatarURL) {
        if(!validateUrl(character.avatarURL)) {
            throw Error('provide a valid url for avatar')
        }
    }
    

    characters.push(character)
    guild.characters = characters
    guild.markModified('characters')

    await guild.save() 
    return characters
}

function validateUrl(value: string) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

function compareNames(first: string, second: string): boolean {
    if(!first || !second) return false

    if(first.toLocaleLowerCase() === second.toLocaleLowerCase()) {
        return true
    } else {
        return false
    }
}

function findCharacterIndex(characters: any, characterName: string): number {
    const index = characters.findIndex((item: CharacterObject) => {
        return compareNames(item.username, characterName)
    })

    return index
}

export default {
    retriveAllCharacters,
    getCharacter,
    pushCharacter,
    editCharacter,
    findGuild,
    setWebhookChannel,
    deleteCharacter
}