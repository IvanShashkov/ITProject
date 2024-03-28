import {userProps} from "@/store/slice/initial.ts"

type filterUsersTableProps = {
    filterSelect: '_id' | 'username',
    filterSearch: string,
    data: userProps[] | undefined
}

export const filterUsersTable = ({ filterSelect, filterSearch, data }: filterUsersTableProps) => {
    if (!data) {
        return []
    }
    // @ts-ignore
    return data.filter(user => user[filterSelect].toLowerCase().includes(filterSearch.toLowerCase()))
}