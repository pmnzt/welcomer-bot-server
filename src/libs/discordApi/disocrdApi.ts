import { createMessage, typing, deleteMessage, editMessage } from './Endpoints'
import Request from './requestHandler'
class Client {

    constructor(
     private token: string
    ){}

    async sendMessage(channel_id: string, message: any) {
        const request = new Request(this.token)

        const response = await request.apiCall(createMessage(channel_id), {
            method: 'post',
            body: message
        })
 
        return response
    }

    async sendTyping(channel_id: string) {
        const requset = new Request(this.token)

        const response = await requset.apiCall(typing(channel_id), {
           method: 'post', 
           body: undefined
        })

        return response
    }

    async deleteMessage(channel_id: string, message_id: string) {
        const request = new Request(this.token)

        const response = await request.apiCall(deleteMessage(channel_id, message_id), {
            method: 'DELETE',
            body: undefined
        })

        return response
    }

    async editMessage(channel_id: string, message_id: string, message: any) {
        const request = new Request(this.token)

        const response = await request.apiCall(
            editMessage(channel_id, message_id), {
            method: 'PATCH',
            body: message
        })

        return response
    }
}

export default Client