import fetch from "node-fetch";
const BASE_URL = 'https://discord.com/api'

class Request {
    constructor(
        private token: string
    ){}

    async apiCall(endpoint: string,
        options = { method: 'get', body: undefined}
        ) {
        
        let resposne: any
        try {
            resposne = await fetch(`${BASE_URL}/${endpoint}`, {
                method: options.method,
                body: JSON.stringify(options.body),
                headers: {
                    "content-type": "application/json",
                    'Authorization': `Bot ${this.token}`
                }
            })


        } catch(err: any) {
            resposne = {
                error: err.message
            }
        }

        const josn_resposne: any = {
            status: resposne.status
        }
        
        try {
            josn_resposne.body = await resposne.json()
        } catch (err) {
            
        }

        resposne = josn_resposne

       return resposne
   
   }
}

export default Request