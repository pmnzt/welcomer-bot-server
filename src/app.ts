import express, { Request, Response } from 'express'
import { port, token, dbURI } from './config'
import cors from 'cors'
import mongoose from 'mongoose'
const app = express()

import Eris, { Client } from 'eris'
import { sendWelcomMessage } from './controller/WebhookController'
import { CharacterObject } from './controller/Character'

const bot: Client = new (Eris as any)(token, {
    intents: 32767
})

bot.on('ready', () => {
    console.log(`${bot.user.username} is ready!`)
    bot.editStatus({ name: "greeting new members", type: 0 })
})


bot.on('guildMemberAdd', async (guild, member) => {
    const db: any = await guildController.getGuild(guild.id, { addGuildIfNotExist: false})
        
        if(!db) return
        if(!db.channelId || !db.characters.length) return

        sendWelcomMessage(bot, db.characters, guild.id, db.channelId, member.user.id)
})

bot.on('interactionCreate', async (interaction) => {
    if(interaction.type !== 2) return
    try {
        await interaction.defer(64)
    } catch(err: any) {
        console.log(err.message)
    }
    if(!interaction.data) return

    try {   
        if(!interaction.member?.permissions.has("manageWebhooks")) {
            throw Error('you must have MANAGE_WEBHOOK permission to use this command')
        }
        switch((interaction.data as any).options[0].name) {
            case "all":
                await interactionCommands.findAllCharacters(interaction)
                break;
            case "add": 
                    await interactionCommands.addCharacter(interaction)
                break;
            case "edit": 
                    await interactionCommands.editCharacter(interaction)
                break;
            case "info":
                    await interactionCommands.infoCharacter(interaction)
                break;
            case "delete":
                    await interactionCommands.deleteCharacter(interaction)
                break;
            case "channel":
                    await interactionCommands.setChannel(interaction)
                break;
        }
    } catch(err: any) {
        interaction.createMessage({ content: `Error: ${err.message}`, flags: 64 })
    }
})

bot.connect()
mongoose.connect(dbURI, () => {
    console.log('db conncted')
})

app.use(cors())
app.use(express.json())

import guildRouter from './routes/guild'
import guildController from './controller/guild'
import interactionCommands from './commands/interactionCommands'
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok'
    })
})
app.use('/guild', guildRouter)




app.listen(port, () => {
    console.log(`server running on ${port}`)
})