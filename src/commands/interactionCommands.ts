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

            return await interaction.createMessage({ embeds: [embed]})
}

const addCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characterName = (interaction.data as any).options[0].options[0].value
    const characterMessage = (interaction.data as any).options[0].options[1].value
    // optinal value
    const characterAvatarUrl = ((interaction.data as any).options[0].options[2]) ? (interaction.data as any).options[0].options[2].value : ""
    
            const characters = await guildController.pushCharacter(interaction.guildID!, {
                username: characterName,
                content: characterMessage,
                avatarURL: characterAvatarUrl
            })

            const embed: any = formatCharactersEmbed(characters)
            return await interaction.createMessage({
                embeds: [embed]
            })
}

const editCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    // console.log(getOption((interaction.data as any).options[0].options, "name"), getOption((interaction.data as any).options[0].options, "message"), getOption((interaction.data as any).options[0].options, "avatar"))


    const targetCharacter = (interaction.data as any).options[0].options[0].value

    // optinal value
    const characterName = getOption((interaction.data as any).options[0].options, "name") ? getOption((interaction.data as any).options[0].options, "name").value : ""

    // optinal value
    const characterMessage = getOption((interaction.data as any).options[0].options, "message") ? getOption((interaction.data as any).options[0].options, "message").value : ""

    // optinal value
    const characterAvatarUrl = getOption((interaction.data as any).options[0].options, "avatar") ? getOption((interaction.data as any).options[0].options, "avatar").value : ""

        const character = await guildController.editCharacter(interaction.guildID!, targetCharacter, {
            username: characterName,
            content: characterMessage,
            avatarURL: characterAvatarUrl
        })

        const embed: any = formatASingalCharacterEmbed(character)
        return await interaction.createMessage({
            embeds: [embed]
        })

}

const infoCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characterName = (interaction.data as any).options[0].options[0].value

            const character: CharacterObject = await guildController.getCharacter(interaction.guildID!, characterName)

            const infoEmbed: any = formatASingalCharacterEmbed(character)

            return await interaction.createMessage({
                embeds: [infoEmbed]
            })
}

const deleteCharacter = async (interaction: CommandInteraction | UnknownInteraction) => {
    const characterName = (interaction.data as any).options[0].options[0].value

            const characters = await guildController.deleteCharacter(interaction.guildID!, characterName)

            const embed: any = formatCharactersEmbed(characters)

            return await interaction.createMessage({ embeds: [embed]})
}

const setChannel = async (interaction: CommandInteraction | UnknownInteraction) => {
    const channelID = (interaction.data as any).options[0].options[0].value

            if((channelID).length > 50 || isNaN(channelID)) {
                throw Error('please enter a valid channel id')
            } 
            await guildController.setWebhookChannel(interaction.guildID!, channelID)
            return interaction.createMessage({ embeds: [{
                    title: 'New Welcoming channel',
                    description: `<#${channelID}>`
                }]
            })

}

const helpCommand = async (interaction: CommandInteraction | UnknownInteraction) => {
    interaction.createMessage(`https://discord.gg/BqHQSf65b2
    `)
} 

function getOption(options: any, name: string) {
    return options.find((option: any) => option.name === name)
}

export default {
    findAllCharacters,
    addCharacter,
    editCharacter,
    infoCharacter,
    deleteCharacter,
    setChannel,
    helpCommand
}