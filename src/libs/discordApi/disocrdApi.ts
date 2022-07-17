import { createMessage, typing } from './Endpoints'
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
}

export default Client