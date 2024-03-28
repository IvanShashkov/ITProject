import {
    Button,
    Input,
    Space
} from "antd"
import {
    CloseOutlined,
    SearchOutlined
} from "@ant-design/icons"

import {Dispatch, SetStateAction} from "react"
import {useTranslation} from "react-i18next"

import {initialInput, inputType} from "@/defaults/contants.ts"

import {filterCollectionsTable} from "@/features/collections/utils/filterCollectionsTable.ts"
import {collectionsList} from "@/features/collections/types/collectionType.ts"

type CollectionSearchFilter = {
    setCollectionsList: Dispatch<SetStateAction<collectionsList>>,
    collectionsList: collectionsList,
    filterSearch: inputType,
    setFilterSearch: Dispatch<SetStateAction<inputType>>
}

const CollectionSearchFilter = ({ filterSearch, setFilterSearch, setCollectionsList, collectionsList }: CollectionSearchFilter) => {
    const { t } = useTranslation()

    const setFilter = () => {
        if (!filterSearch.value) {
            return
        }
        setCollectionsList({
            ...collectionsList,
            filtered: filterCollectionsTable({
                collections: collectionsList.initial,
                filterSearch: filterSearch.value
            })
        })
    }

    const clearFilter = () => {
        setFilterSearch(initialInput)
        setCollectionsList({
            ...collectionsList,
            filtered: collectionsList.initial
        })
    }

    return (
        <Space.Compact
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    setFilter()
                }
            }}
        >
            <Input
                size={'large'}
                value={filterSearch.value}
                onChange={(event) => {
                    setFilterSearch({ value: event.target.value, status: undefined })
                }}
                placeholder={t('Collections name')}
            />
            <Button
                size={'large'}
                onClick={setFilter}
                disabled={!filterSearch.value}
            >
                <SearchOutlined />
            </Button>
            <Button
                size={'large'}
                onClick={clearFilter}
            >
                <CloseOutlined />
            </Button>
        </Space.Compact>
    )
}

export default CollectionSearchFilter