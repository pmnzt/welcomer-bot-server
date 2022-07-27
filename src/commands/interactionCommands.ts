import { CommandInteraction, UnknownInteraction } from 'eris'
import { CharacterObject } from '../controller/Character'
import guildController from '../controller/guild'
const findAllCharacters = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characters: CharacterObject[] = await guildController.retriveAllCharacters(interaction.guildID!)

            const charactersFields: any = []
             
            console.log(characters)

            characters.forEach((character: CharacterObject) => {
                charactersFields.push({
                    name: `Name: ${character.username}`,
                    value: `Message: ${character.content}`
                })
            })

            if(characters.length === 0) {
                charactersFields.push({
                    name: 'Not Found',
                    value: 'There Are No Characers in This Server',
                    inline: true
                })
            }

            const embed = {
                title: 'Characters',
                description: 'All Characters in this server',
                fields: charactersFields
            }

            try {
                interaction.createMessage({ embeds: [embed]})
            } catch(err: any) {
                console.log(err.message)
            }
}

const addCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    interaction.createMessage('add character')
}

const editCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    interaction.createMessage('edit character')
}

const infoCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characterName = (interaction.data as any).options[0].options[0].value

        try {
            const character: CharacterObject = await guildController.getCharacter(interaction.guildID!, characterName)

            const infoEmbed: any = {
                title: `${character.username}`,
                description: `${character.content}`,
            }

            if(character.avatarURL) {
                infoEmbed.thumbnail = {
                    url: `${character.avatarURL}`
                }
            }

            interaction.createMessage({
                embeds: [infoEmbed]
            })
        } catch(err: any) {
            interaction.createMessage(`Error: ${err.message}`)
        }
}

const deleteCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characterName = (interaction.data as any).options[0].options[0].value

        try {
            const guild = await guildController.deleteCharacter(interaction.guildID!, characterName)

            interaction.createMessage({
                embeds: [{
                    title: 'Done!',
                    description: JSON.stringify(guild)
                }]
            })
        } catch(err: any) {
            interaction.createMessage(`Error: ${err.message}`)
        }
}

const setChannel = async (interaction: CommandInteraction | UnknownInteraction) => {
    const channelID = (interaction.data as any).options[0].options[0].value

        try {
            await guildController.setWebhookChannel(interaction.guildID!, channelID)
            interaction.createMessage({ embeds: [{
                    title: 'New Welcoming channel',
                    description: `<#${channelID}>`
                }]
            })
        } catch(err: any) {
            interaction.createMessage(`Error: ${err.message}`)
        }

}

export default {
    findAllCharacters,
    addCharacter,
    editCharacter,
    infoCharacter,
    deleteCharacter,
    setChannel
}