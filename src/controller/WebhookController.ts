import { channel } from 'diagnostics_channel'
import Eris, { Client, Guild, Member } from 'eris'
import Character from './Character'

 
const db = {
        guildId: '741637768597209151',
        characters: [{
            username: 'Eugene',
            avatar_url: 'https://exploringbits.com/wp-content/uploads/2021/09/Eugene-PFP.jpg?ezimgfmt=rs:352x467/rscb3/ng:webp/ngcb3',
            content: 'Hey, $$user, welcome to the server. Now listen here, kiddo, I AM NOT AN EGG!!!'
        }]
    }

const pickRandomCharacter = (characters: Character[]): Character => {
    const randomIndex = Math.floor(Math.random() * characters.length)

    return characters[randomIndex]
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
const testSendWelcomMessage = (bot: Client, userId: string) => {
    const characters: Character[] = []
    db.characters.forEach(character => {
        characters.push(new Character(character.username, character.avatar_url, character.content))
    })

    const finalCharacter = pickRandomCharacter(characters)
    bot.executeWebhook('1000912663192293396', 'uE1_aLhW8OL04QX6sEB1-nO5OP4MrWztSn01hcp5qikgJVBNrOWb9tmggDcJFN61Ypa1', {
        ...finalCharacter.getWebhookObject(userId)
    })
}


export {
    sendWelcomMessage,
    testSendWelcomMessage
}