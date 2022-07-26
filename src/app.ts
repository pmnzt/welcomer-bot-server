import express, { Request, Response } from 'express'
import { port, token, dbURI } from './config'
import cors from 'cors'
import mongoose from 'mongoose'
const app = express()

import Eris, { Client } from 'eris'
import { sendWelcomMessage } from './controller/WebhookController'

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
        const db: any = await getGuild(message.guildID!, { addGuildIfNotExist: false})
        
        if(!db) return
        if(!db.channelId || !db.characters.length) return

        sendWelcomMessage(bot, db.characters, message.guildID!, db.channelId, message.author.id)
    }
})


bot.on('interactionCreate', async (interaction) => {
    if(interaction.type !== 2) return
    
    console.log(interaction.data)
    if(!interaction.data) return
    try {
        const def = await interaction.defer()
        interaction.createFollowup({ content: 'wait bro'})
    } catch(err: any) {
        console.log(err.message)
    }
     
    if((interaction.data as any).name === "characters") {
        if((interaction.data as any).options[0].name === "all") {
            
            interaction.createMessage({ content: 'all'})
            .catch(err => {console.log(err.message)})
        }
    }
})

bot.connect()
mongoose.connect(dbURI, () => {
    console.log('db conncted')
})

app.use(cors())
app.use(express.json())

import guildRouter from './routes/guild'
import { getGuild } from './controller/guild'
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok'
    })
})
app.use('/guild', guildRouter)




app.listen(port, () => {
    console.log(`server running on ${port}`)
})

