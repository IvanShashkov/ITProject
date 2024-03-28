import api from "@/api/api.ts";

type authPayload = {
    username: string,
    password: string,
}

export const authApi =  {
    login: ({ username, password }: authPayload) => {
        return api.post('/login', {username, password})
    },
    registration: ({ username, password }: authPayload) => {
        return api.post('/registration', {username, password})
    },
    getUserById: ({userId}: { userId: string }) => {
        return api.post('/getUserById',{ userId })
    }
}