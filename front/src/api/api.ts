import httpClient from "@/api/httpClient.ts"

const api = {
    async get(url: string, payload: any) {
        try {
            return await httpClient.get(url, {
                params: payload,
            })
        } catch (error) {
            throw error
        }
    },

    async post(url: string, payload: any) {
        try {
            return await httpClient.post(url, payload)
        } catch (error) {
            throw error
        }
    },

    async put(url: string, payload: any) {
        try {
            return await httpClient.put(url, payload)
        } catch (error) {
            throw error
        }
    },

    async patch(url: string, payload: any) {
        try {
            return await httpClient.patch(url, payload)
        } catch (error) {
            throw error
        }
    },

    async delete(url: string, payload: any) {
        try {
            return await httpClient.delete(url, payload)
        } catch (error) {
            throw error
        }
    },
}

export default api
