import api from "../../api/api"
import {Key} from "react"

type getUsersProps = {
    idCollection?: Key[],
    rolesArr?: string[]
}

const adminApi = {
    getUsers: () => {
        return api.get('/users', {})
    },
    getBan: ({ idCollection }: getUsersProps) => {
        return api.post('/ban', { idCollection })
    },
    getUnban: ({ idCollection }: getUsersProps) => {
        return api.post('/unban', { idCollection })
    },
    getDelete: ({ idCollection }: getUsersProps) => {
        return api.post('/delete', { idCollection })
    },
    setRoles: ({ idCollection, rolesArr }: getUsersProps) => {
        return api.post('/setRoles', { idCollection, rolesArr })
    }
}

export default adminApi