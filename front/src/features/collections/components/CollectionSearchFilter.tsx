import {
    Input,
} from "antd"

import {Dispatch, SetStateAction} from "react"
import {useTranslation} from "react-i18next"

import {inputType} from "@/defaults/contants.ts"

import {filterCollectionsTable} from "@/features/collections/utils/filterCollectionsTable.ts"
import {collectionsList} from "@/features/collections/types/collectionType.ts"
import {useDebouncedCallback} from "use-debounce"

type CollectionSearchFilter = {
    setCollectionsList: Dispatch<SetStateAction<collectionsList>>,
    collectionsList: collectionsList,
    filterSearch: inputType,
    setFilterSearch: Dispatch<SetStateAction<inputType>>
}

const CollectionSearchFilter = ({ filterSearch, setFilterSearch, setCollectionsList, collectionsList }: CollectionSearchFilter) => {
    const { t } = useTranslation()

    const setFilter = () => {
        setCollectionsList({
            ...collectionsList,
            filtered: filterCollectionsTable({
                collections: collectionsList.initial,
                filterSearch: filterSearch.value
            })
        })
    }

    const debouncedSetFilter = useDebouncedCallback(setFilter, 300)

    return (
        <Input
            size={'large'}
            value={filterSearch.value}
            onChange={(event) => {
                setFilterSearch({ value: event.target.value, status: undefined })
                debouncedSetFilter()
            }}
            placeholder={t('Collections name')}
        />
    )
}

export default CollectionSearchFilter