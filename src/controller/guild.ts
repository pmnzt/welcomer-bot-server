import Guild from '../models/Guild'
import { CharacterObject } from './Character'

const retriveAllCharacters = async (guildId: string) => {
    const characters = await Guild.find({ guildId: guildId }, 'characters')

    if(!characters) {
        return []
    }

    return characters[0].characters
}

const getCharacter = async (guildId: string, characterName: string) => {
    const guild = await Guild.findOne({ guildId: guildId })
    if(!guild) throw Error('this character doesnt exist!');

    const characterIndex = guild.characters.findIndex((character: CharacterObject) => {
        return (character.username).toLocaleLowerCase() === (characterName).toLocaleLowerCase()
    })

    if(characterIndex === -1) throw Error('this character doesnt exist');

    return guild.characters[characterIndex]
}

const deleteCharacter = async (guildId: string, characterName: string) => {
    const guild = await Guild.findOne({ guildId: guildId })
    if(!guild) throw Error('this character doesnt exist!');

    const characterIndex = guild.characters.findIndex((character: CharacterObject) => {
        return (character.username).toLocaleLowerCase() === (characterName).toLocaleLowerCase()
    })

    if(characterIndex === -1) throw Error('this character doesnt exist');

    guild.characters.splice(characterIndex, 1)
    await guild.save() 
    return guild.characters
}

const editCharacter = async (guildId: string, characterName: string, character: CharacterObject) => {
    const guild = await Guild.findOne({ guildId: guildId })
    if(!guild) throw Error('this character doesnt exist!');

    const characterIndex = guild.characters.findIndex((character: CharacterObject) => {
        return character.username === characterName
    })

    
    if(characterIndex === -1) throw Error('this character doesnt exist');
    
    if(character.username) {
        if((character.username).length > 80) {
            throw Error('characters names could not be longer than 80 char')
        }
        guild.characters[characterIndex].username = character.username
    }

    if(character.content) {
        if((character.content).length > 100) {
            throw Error('message content could not be longer than 100 char')
        }
        guild.characters[characterIndex].content = character.content
    }

    if(character.avatarURL) {
        if(!validateUrl(character.avatarURL)) {
            throw Error('provide a valid url for avatar')
        }
        guild.characters[characterIndex].avatarURL = character.avatarURL
    }

    guild.markModified('characters')
    await guild.save() 
    return guild.characters[characterIndex]
}

const setWebhookChannel = async (guildId: string, channelId: string) => {
    if(!guildId || !channelId) throw Error('guildId or channelId is missing')
    
    const guild = await Guild.findOne({ guildId: guildId })
    ?? await addGuild(guildId)

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

const getGuild = async (guildId: string, options: getGuildOptions = { addGuildIfNotExist: true}) => {
    let guild = {}
    if(options.addGuildIfNotExist) {
       guild = await Guild.findOne({ guildId: guildId })
        ?? await addGuild(guildId)
    } else {
       guild = await Guild.findOne({ guildId: guildId })
    }
   

    return guild
}

const pushCharacter = async (guildId: string, character: CharacterObject) => {
    const guild = await Guild.findOne({ guildId: guildId })
    ?? await addGuild(guildId)

    if(guild.characters.length > 9) throw Error('this guild reached out the max amount of characters')

    const characterIndex = guild.characters.findIndex((item: CharacterObject) => {
        return item.username === character.username
    })

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
    

    guild.characters.push(character)
    await guild.save() 

    return guild.characters
}

function validateUrl(value: string) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

export default {
    retriveAllCharacters,
    getCharacter,
    pushCharacter,
    editCharacter,
    getGuild,
    setWebhookChannel,
    deleteCharacter
}