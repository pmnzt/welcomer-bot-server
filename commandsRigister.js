const Eris = require('eris')
require('dotenv').config()

const client = new Eris(process.env.BOT_TOKEN)
const guildID = "741637768597209151"
 
const charactersCommand = {
    "name": "characters",
    "description": "Manage the welcomer characters",
    "options": [
        {        
            "name": "all",
            "description": "display all the existing characters",
            "type": 1,
        },
        {        
            "name": "add",
            "description": "add a new character",
            "type": 1,
            "options": [
                {
                    "name": "name",
                    "description": "the character name",
                    "type": 3, // 3 is type STRING
                    "required": true
                },
                {
                    "name": "message",
                    "description": "the welcoming message, include $$user if you want to ping the joined user",
                    "type": 3, // 3 is type STRING
                    "required": true
                },
                {
                    "name": "avatar",
                    "description": "the avatar url",
                    "type": 3, // 3 is type STRING
                },
            ]
        },
        {        
            "name": "edit",
            "description": "edit an existing character",
            "type": 1, 
            "options": [
                {
                    "name": "target",
                    "description": "the target character name",
                    "type": 3, // 3 is type STRING
                    "required": true
                },
                {
                    "name": "name",
                    "description": "the new character name",
                    "type": 3,
                },
                {
                    "name": "message",
                    "description": "the welcoming message, include $$user if you want to ping the joined user",
                    "type": 3,
                },
                {
                    "name": "avatar",
                    "description": "the new avatar url",
                    "type": 3, // 3 is type STRING
                },
            ]
        },
        {        
            "name": "info",
            "description": "get infos about an existing character",
            "type": 1,
            "options": [
                {
                    "name": "name",
                    "description": "the target character name",
                    "type": 3, // 3 is type STRING
                    "required": true
                }
            ]
        },
        {        
            "name": "delete",
            "description": "delete an existing character",
            "type": 1,
            "options": [
                {
                    "name": "name",
                    "description": "the character name to be deleted",
                    "type": 3, // 3 is type STRING
                    "required": true
                }
            ]
        }
    ]
}

const welcomer = {    
    "name": "welcomer",
    "description": "configure the welcomer",
    "options": [{
        "name": "channel",
        "description": "Welcomer messages channel",
        "type": 1, 
        "options": [
            {
                "name": "channel",
                "description": "the channel to setup the welcomer in",
                "type": 7, // 7 is type CHANNEL
                "required": true,
                "channel_types": [
                    0
                ]
            }
        ]},
        {
            "name": "help",
            "description": "feeling lost ? use this command to help you",
            "type": 1, 
        }
    ]
}

const register = async () => {
    const command1 = await client.createCommand(charactersCommand, 1)

    const command2 = await client.createCommand(welcomer, 1)

    console.log(command1, command2)
}
client.on('ready', () => {
    console.log('Ready!')
    register()
})
client.connect()
