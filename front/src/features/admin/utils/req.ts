import adminApi from "@/features/admin/api.ts"
import setAxiosError from "@/plugins/setAxiosError.ts"
import {filterUsersTable} from "@/features/admin/utils/filterUsersTable.ts"

import {userProps} from "@/store/slice/initial.ts";
import {usersList} from "@/features/admin/pages/Admin.tsx"
import {Key, SetStateAction, Dispatch} from "react"

type adminReqProps = { data: { users: userProps[] } }

type reqProps = {
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    setUsersList: Dispatch<SetStateAction<usersList>>,
    selected: Key[],
    filterSearch: string,
    filterSelect: '_id' | 'username',
}


export const getUsers = async ({ setIsLoading, setUsersList}: Pick<reqProps, 'setIsLoading' | 'setUsersList'>) => {
    setIsLoading(true)
    try {
        const { data: { users } }: adminReqProps  = await adminApi.getUsers()
        setUsersList({
            initial: users,
            filtered: users,
            selected: []
        })
    } catch (error) {
        setAxiosError(error)
    } finally {
        setIsLoading(false)
    }
}
export const getBan = async ({ setIsLoading, setUsersList, filterSearch, filterSelect, selected} : reqProps) => {
    setIsLoading(true)
    try {
        const { data: { users } }: adminReqProps = await adminApi.getBan({ idCollection: selected})
        setUsersList({
            initial: users,
            filtered: filterUsersTable({ filterSearch, filterSelect, data: users }),
            selected: []
        })
    } catch (error) {
        setAxiosError(error)
    } finally {
        setIsLoading(false)
    }
}
export const getUnban = async ({ setIsLoading, setUsersList, filterSearch, filterSelect, selected} : reqProps) => {
    setIsLoading(true)
    try {
        const { data: { users } }: adminReqProps = await adminApi.getUnban({ idCollection: selected})
        setUsersList({
            initial: users,
            filtered: filterUsersTable({ filterSearch: filterSearch, filterSelect, data: users }),
            selected: []
        })
    } catch (error) {
        console.log(error)
    } finally {
        setIsLoading(false)
    }
}

export const getDelete = async ({ setIsLoading, setUsersList, filterSearch, filterSelect, selected} : reqProps) => {
    setIsLoading(true)
    try {
        const { data: { users } }: adminReqProps = await adminApi.getDelete({ idCollection: selected})
        setUsersList({
            initial: users,
            filtered: filterUsersTable({ filterSearch: filterSearch, filterSelect, data: users }),
            selected: []
        })
    } catch (error) {
        console.log(error)
    } finally {
        setIsLoading(false)
    }
}

export const getAdmin = async ({ setIsLoading, setUsersList, filterSearch, filterSelect, selected} : reqProps) => {
    setIsLoading(true)
    try {
        const { data: { users } }: adminReqProps = await adminApi.setRoles({ idCollection: selected, rolesArr: ['user', 'admin']})
        setUsersList({
            initial: users,
            filtered: filterUsersTable({ filterSearch: filterSearch, filterSelect, data: users }),
            selected: []
        })
    } catch (error) {
        console.log(error)
    } finally {
        setIsLoading(false)
    }
}

export const removeAdmin = async ({ setIsLoading, setUsersList, filterSearch, filterSelect, selected} : reqProps) => {
    setIsLoading(true)
    try {
        const { data: { users } }: adminReqProps = await adminApi.setRoles({ idCollection: selected, rolesArr: ['user']})
        setUsersList({
            initial: users,
            filtered: filterUsersTable({ filterSearch: filterSearch, filterSelect, data: users }),
            selected: []
        })
    } catch (error) {
        console.log(error)
    } finally {
        setIsLoading(false)
    }
}