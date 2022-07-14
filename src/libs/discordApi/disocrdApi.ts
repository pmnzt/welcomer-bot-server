import { createMessage } from './Endpoints'
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

        const data = await response.json()
 
        return data
    }
}

export default Client