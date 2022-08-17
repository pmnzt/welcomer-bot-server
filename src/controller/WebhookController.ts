import Eris, { Client, Webhook } from 'eris'
import { Character, CharacterObject } from './Character'


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

    const defualtChannelHasBeenChanged = guildDefaultWebhook.channel_id !== channelId


    if(defualtChannelHasBeenChanged) {
        await bot.editWebhook(guildDefaultWebhook.id, {
            channelID: channelId
        })
    }

    return guildDefaultWebhook
}

const sendWelcomMessage = async (bot: Client, characters: CharacterObject[], guildId: string, channelId: string, userId: string) => {
    const characterObjects: Character[] = []

    characters.forEach(character => {
        characterObjects.push(new Character(character.username, character.avatarURL, character.content))
    })

    const finalCharacter = pickRandomCharacter(characterObjects)
    
    // send to the webhook channel

    try {
        const guild = bot.guilds.get(guildId)!
        const guildWebhooks = await guild.getWebhooks()

        const webhook: Webhook = await retriveWelcomerWebhook(guildWebhooks, bot,channelId, 'welcomer')
        
        await bot.executeWebhook(webhook.id, webhook.token!, {
            ...finalCharacter.getWebhookObject(userId)
        })
    } catch(err: any) {
        console.log(err.message)
    }
}


export {
    sendWelcomMessage
}