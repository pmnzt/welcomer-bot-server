import { channel } from 'diagnostics_channel'
import Eris, { Client, Guild, Member, Webhook } from 'eris'
import Character from './Character'

 
const db = {
        guildId: '741637768597209151',
        channelId: '1000979253128605718',
        name: 'welcomer2',
        characters: [
            { username: 'Eugene', avatar_url: 'https://exploringbits.com/wp-content/uploads/2021/09/Eugene-PFP.jpg?ezimgfmt=rs:352x467/rscb3/ng:webp/ngcb3', content: 'Hey, $$user, welcome to the server. Now listen here, kiddo, I AM NOT AN EGG!!!'}, 
            { username: 'Pablo', avatar_url: 'https://static.wikia.nocookie.net/beluga/images/9/99/Pablo.jpg/revision/latest?cb=20210730192800', content: '$$user, welcome to the server.... sweetie...' }, 
            { username: 'Ralph', avatar_url: 'https://static.wikia.nocookie.net/beluga/images/9/95/Ralph.jpg/revision/latest/top-crop/width/360/height/360?cb=20220107044446', content: 'Welcome to the server $$user. We have a few rules.' }, 
            { username: 'belu-mom 🌸', avatar_url: 'https://static.wikia.nocookie.net/beluga/images/0/0d/Belu-mom.png/revision/latest?cb=20211211211134', content: ':bell: :bell: :bell: Welcome $$user, I hope you are more well behaved than my son Beluga....' }, 
            { username: 'skittle', avatar_url: 'https://static.wikia.nocookie.net/beluga/images/f/f6/Skittle.jpg/revision/latest?cb=20210730213705', content: "I am Beluga's best friend. Maybe I can also be friends with $$user, they just joined the server." }, 
            { username: 'hecker', avatar_url: 'https://static.wikia.nocookie.net/beluga/images/e/ea/Avahecher.png/revision/latest?cb=20220518222816&path-prefix=ru', content: "$ sudo heck welcome $$user" } 
            ] 
    }

const pickRandomCharacter = (characters: Character[]): Character => {
    const randomIndex = Math.floor(Math.random() * characters.length)

    return characters[randomIndex]
}

const createWbhook = async (bot: Client, channelId: string, webhookName: string): Promise<Webhook> => {
    const webhook: Webhook = await bot.createChannelWebhook(channelId, {
        name: webhookName, 
        avatar: ''
    })

    return webhook
}

const retriveWelcomerWebhook = async (guildWebhooks: Webhook[],bot: Client, channelId: string, webhookDefualtName: string): Promise<Webhook> => {
    const thereAreNoWebhooks = guildWebhooks.length === 0
    if(thereAreNoWebhooks) return await createWbhook(bot, channelId, webhookDefualtName)

     
    const guildDefaultWebhookIndex = guildWebhooks.findIndex((guildWebhook: Webhook) => {
        return guildWebhook.name === webhookDefualtName
    }) 
 

    const doesGuildDefaultWebhookExist = (guildDefaultWebhookIndex !== -1)
    
    if(!doesGuildDefaultWebhookExist) return await createWbhook(bot, channelId, webhookDefualtName)

    const guildDefaultWebhook = guildWebhooks[guildDefaultWebhookIndex]

    return guildDefaultWebhook
}

const sendWelcomMessage = (bot: Client, guild: Guild, member: Member) => {
    const characters: Character[] = []
    db.characters.forEach(character => {
        characters.push(new Character(character.username, character.avatar_url, character.content))
    })

    const finalCharacter = pickRandomCharacter(characters)
    bot.executeWebhook('1000912663192293396', 'uE1_aLhW8OL04QX6sEB1-nO5OP4MrWztSn01hcp5qikgJVBNrOWb9tmggDcJFN61Ypa1', {
        ...finalCharacter.getWebhookObject(member.user.id)
    })
}


// test
const testSendWelcomMessage = async (bot: Client, guildId: string, userId: string) => {
    const characters: Character[] = []
    db.characters.forEach(character => {
        characters.push(new Character(character.username, character.avatar_url, character.content))
    })

    const finalCharacter = pickRandomCharacter(characters)
    
    // send to the webhook
    const guild = bot.guilds.get(guildId)!
    const guildWebhooks = await guild.getWebhooks()
    const webhook: Webhook = await retriveWelcomerWebhook(guildWebhooks, bot,db.channelId, db.name)
    
    bot.executeWebhook(webhook.id, webhook.token, {
        ...finalCharacter.getWebhookObject(userId)
    })
}


export {
    sendWelcomMessage,
    testSendWelcomMessage
}