const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GuildSchema = new Schema({
    guildId: { 
        type: String, 
        required: true,
        unique: [true, 'must be unique']
    },
    channelId: {
        type: String, 
        default: null
    },
    characters: []
})

 
const Guild = mongoose.model('Guild', GuildSchema);
 
export default Guild