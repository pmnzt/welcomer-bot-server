import Guild from '../models/Guild'
import { CharacterObject } from './Character'

const retriveAllCharacters = async (guildId: string) => {
    const characters = await Guild.find({ guildId: guildId }, 'characters')
    return characters[0].characters
}

const getCharacter = async (guildId: string, characterName: string) => {
    const guild = await Guild.findOne({ guildId: guildId })
    if(!guild) throw Error('this character doesnt exist!');

    const characterIndex = guild.characters.findIndex((character: CharacterObject) => {
        return character.username === characterName
    })

    if(characterIndex === -1) throw Error('this character doesnt exist');

    return guild.characters[characterIndex]
}

const deleteCharacter = async (guildId: string, characterName: string) => {
    const guild = await Guild.findOne({ guildId: guildId })
    if(!guild) throw Error('this character doesnt exist!');

    const characterIndex = guild.characters.findIndex((character: CharacterObject) => {
        return character.username === characterName
    })

    if(characterIndex === -1) throw Error('this character doesnt exist');

    guild.characters.splice(characterIndex, 1)
    await guild.save() 
    return guild
}

const editCharacter = async (guildId: string, characterName: string, character: CharacterObject) => {
    const guild = await Guild.findOne({ guildId: guildId })
    if(!guild) throw Error('this character doesnt exist!');

    const characterIndex = guild.characters.findIndex((character: CharacterObject) => {
        return character.username === characterName
    })

    
    if(characterIndex === -1) throw Error('this character doesnt exist');
    
    guild.characters[characterIndex] = character

    await guild.save() 
    return guild
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

    if(guild.characters.length > 4) throw Error('this guild reached out the max amount of characters')

    const characterIndex = guild.characters.findIndex((item: CharacterObject) => {
        return item.username === character.username
    })

    const existedCharacter = (characterIndex !== -1)
    if(existedCharacter) throw Error('this Character exists already')

    guild.characters.push(character)
    await guild.save() 

    return guild
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