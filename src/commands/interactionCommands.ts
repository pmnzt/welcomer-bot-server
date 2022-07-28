import { CommandInteraction, UnknownInteraction } from 'eris'
import { embedsColor } from '../config'
import { CharacterObject } from '../controller/Character'
import guildController from '../controller/guild'

const formatCharactersEmbed = (characters: CharacterObject[]) => {
    const charactersFields: any = []

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
                fields: charactersFields,
                color: embedsColor
            }

            return embed
}

const formatASingalCharacterEmbed = (character: CharacterObject) => {
    const embed: any = {
        title: `${character.username}`,
        description: `${character.content}`,
        color: embedsColor
    }

    if(character.avatarURL) {
        embed.thumbnail = {
            url: `${character.avatarURL}`
        }
    }

    return embed
}

const findAllCharacters = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characters: CharacterObject[] = await guildController.retriveAllCharacters(interaction.guildID!)

            const embed: any = formatCharactersEmbed(characters)

            try {
                await interaction.createMessage({ embeds: [embed]})
            } catch(err: any) {
                console.log(err.message)
            }
}

const addCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characterName = (interaction.data as any).options[0].options[0].value
    const characterMessage = (interaction.data as any).options[0].options[1].value
    // optinal value
    const characterAvatarUrl = ((interaction.data as any).options[0].options[2]) ? (interaction.data as any).options[0].options[2].value : ""
    
        try {
            const characters = await guildController.pushCharacter(interaction.guildID!, {
                username: characterName,
                content: characterMessage,
                avatarURL: characterAvatarUrl
            })

            const embed: any = formatCharactersEmbed(characters)
            await interaction.createMessage({
                embeds: [embed]
            })
        } catch(err: any) {
            console.log(`Error: ${err.message}`)
            await interaction.createMessage(`Error: ${err.message}`).catch(err => console.log(err.message))
        }
}

const editCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    
}

const infoCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characterName = (interaction.data as any).options[0].options[0].value

        try {
            const character: CharacterObject = await guildController.getCharacter(interaction.guildID!, characterName)

            const infoEmbed: any = formatASingalCharacterEmbed(character)

            await interaction.createMessage({
                embeds: [infoEmbed]
            })
        } catch(err: any) {
            await interaction.createMessage(`Error: ${err.message}`).catch(err => {})
        }
}

const deleteCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characterName = (interaction.data as any).options[0].options[0].value

        try {
            const characters = await guildController.deleteCharacter(interaction.guildID!, characterName)

            const embed: any = formatCharactersEmbed(characters)

            try {
                await interaction.createMessage({ embeds: [embed]})
            } catch(err: any) {
                console.log(err.message)
            }
        } catch(err: any) {
            await interaction.createMessage(`Error: ${err.message}`).catch(err => console.log(`Error: ${err.message}`))
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
            await interaction.createMessage(`Error: ${err.message}`).catch(err => {})
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