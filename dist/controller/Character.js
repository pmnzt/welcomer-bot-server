"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
class Character {
    constructor(username, avatar_url, content) {
        this.representUser = "$$user";
        this.username = username;
        this.avatar_url = avatar_url;
        this.content = content;
    }
    makeWelcomeMessage(message, userId) {
        return message.replace(this.representUser, `<@${userId}>`);
    }
    getWebhookObject(userId) {
        return {
            username: this.username,
            avatarURL: this.avatar_url,
            content: this.makeWelcomeMessage(this.content, userId)
        };
    }
}
exports.Character = Character;
