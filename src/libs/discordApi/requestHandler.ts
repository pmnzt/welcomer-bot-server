import fetch from "node-fetch";
const BASE_URL = 'https://discord.com/api'

class Request {
    constructor(
        private token: string
    ){}

    async apiCall(endpoint: string,
        options = { method: 'get', body: undefined}
        ) {
        
        let resposne
        try {
            resposne = await fetch(`${BASE_URL}/${endpoint}`, {
                method: options.method,
                body: JSON.stringify(options.body),
                headers: {
                    "content-type": "application/json",
                    'Authorization': `Bot ${this.token}`
                }
            })
            
            resposne = await resposne.json()

        } catch(err: any) {
            resposne = {
                error: err.message
            }
        }

       return resposne
   
   }
}

export default Request