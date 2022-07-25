import Eris, { Client, Webhook } from 'eris'
import Character from './Character'

 
const db = {
        guildId: '741637768597209151',
        channelId: '1000979253128605718',
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

const sendWelcomMessage = async (bot: Client, guildId: string, userId: string) => {
    const characters: Character[] = []
    db.characters.forEach(character => {
        characters.push(new Character(character.username, character.avatar_url, character.content))
    })

    const finalCharacter = pickRandomCharacter(characters)
    
    // send to the webhook

    try {
        const webhook: Webhook = await createWbhook(bot,db.channelId, 'welcomer')
        
        bot.executeWebhook(webhook.id, webhook.token, {
            ...finalCharacter.getWebhookObject(userId)
        })
    } catch(err: any) {
        console.log(err.message)
    }
}


export {
    sendWelcomMessage
}