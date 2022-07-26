import express, { Request, Response } from 'express'
import Guild from '../models/Guild'
import { CharacterObject } from './Character'

const setWebhookChannel = async (req: Request, res: Response) => {
    const { guildId, channelId } = req.body
    if(!guildId || !channelId) return res.status(402).json({
        error: {
            message: 'guildId or channelId is missing'
        }
    })
    
    const guild = await Guild.findOne({ guildId: guildId })
    ?? await addGuild(guildId)

    guild.channelId = channelId
    await guild.save()

    res.status(200).json({ 
        guild: guild
    })
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

    guild.characters.push(character)
    await guild.save() 

    return guild
}

const addCharacter = async (req: Request, res: Response) => {
    const { guildId, character } = req.body
    if(!guildId || !character) return res.status(402).json({
        error: {
            message: "guildId or character is missing"
        }
    })
    if(!character.content) return res.status(402).json({
        error: {
            message: "at least provide a content."
        }
    })


    const characterItems: CharacterObject = {
        username: character.username,
        avatarURL: character.avatarURL,
        content: character.content
    }
    
    try {
        res.status(200).json({ 
            guild: await pushCharacter(guildId, characterItems)
        })
    } catch(error: any) {
        res.status(409).json({
            error: error.message
        })
    }
    

}


export {
    addCharacter,
    getGuild,
    setWebhookChannel
}