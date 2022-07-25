import express, { Request, Response } from 'express'
import Guild from '../models/Guild'
import { CharacterObject } from './Character'


const addGuild = async (guildId: string) => {
    const guild = new Guild({
        guildId: guildId
    })

    await guild.save()
    return guild
}

const getGuild = async (guildId: string) => {
    const guild = await Guild.findOne({ guildId: guildId })
    ?? await addGuild(guildId)

    return guild
}

const pushCharacter = async (guildId: string, character: CharacterObject) => {
    const guild = await Guild.findOne({ guildId: guildId })
    ?? await addGuild(guildId)

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
    const characterItems: CharacterObject = {
        username: character.username,
        avatarURL: character.avatarURL,
        content: character.content
    }
    
    res.status(200).json({ 
        guild: await pushCharacter(guildId, characterItems)
    })

}


export {
    addCharacter,
    getGuild
}