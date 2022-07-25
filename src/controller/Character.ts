interface WebhookObject {
    username: string,
    avatarURL: string,
    content: string
}


class Character {
    private username: string
    private avatar_url: string
    private content: string
    readonly representUser = "$$user"

    constructor(username: string, avatar_url: string, content: string) {
        this.username = username
        this.avatar_url = avatar_url
        this.content = content
    }

    makeWelcomeMessage(message: string, userId: string) {
        return message.replace(this.representUser, `<@${userId}>`)
    }

    getWebhookObject(userId: string): WebhookObject {
        return {
            username: this.username,
            avatarURL: this.avatar_url,
            content: this.makeWelcomeMessage(this.content, userId)
        }
    }
}

export default Character