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
})

// const db = {
//     guildId: '741637768597209151',
//     channelId: '1000979253128605718',
//     characters: [
//         { username: 'Eugene', avatarURL: 'https://exploringbits.com/wp-content/uploads/2021/09/Eugene-PFP.jpg?ezimgfmt=rs:352x467/rscb3/ng:webp/ngcb3', content: 'Hey, $$user, welcome to the server. Now listen here, kiddo, I AM NOT AN EGG!!!'}, 
//         { username: 'Pablo', avatarURL: 'https://static.wikia.nocookie.net/beluga/images/9/99/Pablo.jpg/revision/latest?cb=20210730192800', content: '$$user, welcome to the server.... sweetie...' }, 
//         { username: 'Ralph', avatarURL: 'https://static.wikia.nocookie.net/beluga/images/9/95/Ralph.jpg/revision/latest/top-crop/width/360/height/360?cb=20220107044446', content: 'Welcome to the server $$user. We have a few rules.' }, 
//         { username: 'belu-mom 🌸', avatarURL: 'https://static.wikia.nocookie.net/beluga/images/0/0d/Belu-mom.png/revision/latest?cb=20211211211134', content: ':bell: :bell: :bell: Welcome $$user, I hope you are more well behaved than my son Beluga....' }, 
//         { username: 'skittle', avatarURL: 'https://static.wikia.nocookie.net/beluga/images/f/f6/Skittle.jpg/revision/latest?cb=20210730213705', content: "I am Beluga's best friend. Maybe I can also be friends with $$user, they just joined the server." }, 
//         { username: 'hecker', avatarURL: 'https://static.wikia.nocookie.net/beluga/images/e/ea/Avahecher.png/revision/latest?cb=20220518222816&path-prefix=ru', content: "$ sudo heck welcome $$user" } 
//         ] 
// }

bot.on('messageCreate', async (message) => {
    if(message.content === '!test') {
        const db: any = await guildController.getGuild(message.guildID!, { addGuildIfNotExist: false})
        
        if(!db) return
        if(!db.channelId || !db.characters.length) return

        sendWelcomMessage(bot, db.characters, message.guildID!, db.channelId, message.author.id)
    }
})



const prefix = '!'
bot.on('messageCreate', async (message) => {
    if(message.content.startsWith(`${prefix}add`)) {
        const args: any = message.content.split(/ +/)
        args.shift()

        const name = args[0]
        const content = args[1]
        const avatarURL = args[2]
        if(!name || !content) return bot.createMessage(message.channel.id, 'first two args are required')

        try {
            const guild = await guildController.pushCharacter(message.guildID!, {
                username: name,
                content: content,
                avatarURL: avatarURL
            })
            bot.createMessage(message.channel.id, {
                embed: {
                    title: 'Added',
                    description: JSON.stringify(guild)
                }
            })
        } catch(err: any) {
            bot.createMessage(message.channel.id, `Error: ${err.message}`)
        }

    }  else if(message.content.startsWith(`${prefix}delete`)) {
        

    } else if(message.content.startsWith(`${prefix}edit`)) {
        const args: any = message.content.split(/ +/)
        args.shift()

        const originalName = args[0]
        const name = args[1]
        const content = args[2]
        const avatarURL = args[3]

        if(!originalName || !name || !content) return bot.createMessage(message.channel.id, 'the original name and the new name and the content are required')

        try {
            const guild = await guildController.editCharacter(message.guildID!,originalName, {
                username: name,
                content: content,
                avatarURL: avatarURL
            })
            bot.createMessage(message.channel.id, {
                embed: {
                    title: 'Edited',
                    description: JSON.stringify(guild)
                }
            })
        } catch(err: any) {
            bot.createMessage(message.channel.id, `Error: ${err.message}`)
        }

    }
})

bot.on('interactionCreate', async (interaction) => {
    if(interaction.type !== 2) return
    try {
        await interaction.defer()
    } catch(err: any) {
        console.log(err.message)
    }
    if(!interaction.data) return

    try {
        switch((interaction.data as any).options[0].name) {
            case "all":
                interactionCommands.findAllCharacters(interaction)
                break;
            case "add": 
                    interactionCommands.addCharacter(interaction)
                break;
            case "edit": 
                    interactionCommands.editCharacter(interaction)
                break;
            case "info":
                    interactionCommands.infoCharacter(interaction)
                break;
            case "delete":
                    interactionCommands.deleteCharacter(interaction)
                break;
            case "channel":
                    interactionCommands.setChannel(interaction)
                break;
        }
    } catch(err: any) {
        console.log(`Error: ${err.message}`)
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