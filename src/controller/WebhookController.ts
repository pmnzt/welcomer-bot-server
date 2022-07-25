import { channel } from 'diagnostics_channel'
import Eris, { Client, Guild, Member } from 'eris'
import Character from './Character'

 
const messages = [{
        guildId: '741637768597209151',
        character: {
            username: 'Eugene',
            avatar_url: 'https://exploringbits.com/wp-content/uploads/2021/09/Eugene-PFP.jpg?ezimgfmt=rs:352x467/rscb3/ng:webp/ngcb3',
            content: 'Hey, $$user, welcome to the server. Now listen here, kiddo, I AM NOT AN EGG!!!'
        }
    }]

const pickRandomCharacter = (characters: Character[]): Character => {
    const randomIndex = Math.floor(Math.random() * characters.length)

    return characters[randomIndex]
}

const sendWelcomMessage = (bot: Client, guild: Guild, member: Member) => {
    const characters: Character[] = []
    messages.forEach(message => {
        const character = new Character(message.character.username, message.character.avatar_url, message.character.content)
        characters.push(character)
    })

    // TODO send the webhook to the guild
}

