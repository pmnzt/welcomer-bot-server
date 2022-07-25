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

const sendWelcomMessage = async (bot: Client, characters: CharacterObject[], channelId: string, userId: string) => {
    const characterObjects: Character[] = []

    characters.forEach(character => {
        characterObjects.push(new Character(character.username, character.avatarURL, character.content))
    })

    const finalCharacter = pickRandomCharacter(characterObjects)
    
    // send to the webhook

    try {
        const webhook: Webhook = await createWbhook(bot,channelId, 'welcomer')
        
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