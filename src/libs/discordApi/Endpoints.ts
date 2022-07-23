export const createMessage = (channel_id: string) => `/channels/${channel_id}/messages`

export const typing = (channel_id: string) => `/channels/${channel_id}/typing`

export const deleteMessage = (channel_id: string, message_id: string) => `/channels/${channel_id}/messages/${message_id}`

export const editMessage = async (channel_id: string, message_id: string) => `/channels/${channel_id}/messages/${message_id}`