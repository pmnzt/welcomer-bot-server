export const createMessage = (channel_id: string) => `/channels/${channel_id}/messages`

export const typing = (channel_id: string) => `/channels/${channel_id}/typing`