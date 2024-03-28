import {useTranslation} from "react-i18next"
import {useNavigateTo} from "@/hooks/useNavigateTo.ts"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"

import {collectionsList, collectionType} from "@/features/collections/types/collectionType.ts"
import {RootState} from "@/store/store.ts"

import api from "@/features/collections/api.ts"
import setAxiosError from "@/plugins/setAxiosError.ts"
import {setLikedCollection} from "@/store/slice/initial.ts"
import {initialInput} from "@/defaults/contants.ts"

import ITContentBox from "@/components/ITContentBox.tsx"
import CollectionSearchFilter from "@/features/collections/components/CollectionSearchFilter.tsx";
import {
    Button,
    Flex,
    Table,
    Typography,
} from "antd"
import Markdown from "react-markdown"

import collectionsTableConfig from "@/features/collections/components/tables/collectionsTableConfig.tsx"
import {filterCollectionsTable} from "@/features/collections/utils/filterCollectionsTable.ts"

const MyCollections = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigateTo = useNavigateTo()

    const userId = useSelector<RootState>(state => state.initial.user._id)
    const [filterSearch, setFilterSearch] = useState(initialInput)
    const [collectionsList, setCollectionsList] = useState<collectionsList>({
        initial: undefined,
        filtered: undefined,
    })
    const [isLoading, setIsLoading] = useState(false)

    const getCollections = async () => {
        setIsLoading(true)
        try {
            const { data } = await api.getUserCollections({ userId: `${userId}` })
            setCollectionsList({
                initial: data.collections,
                filtered: data.collections,
            })
        } catch (error) {
            setAxiosError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteCollection = async (collectionId: string) => {
        try {
            await api.deleteCollectionById({
                collectionId
            })
            const { data } = await api.getUserCollections({ userId: `${userId}` })
            setCollectionsList({
                initial: data.collections,
                filtered: filterCollectionsTable({
                    collections: data.collections,
                    filterSearch: filterSearch.value
                })
            })
        } catch (error) {
            setAxiosError(error)
        }
    }

    const collectionLike = async (collectionId: string) => {
        if (!collectionsList.initial) return
        try {
            const { data } = await api.getLikeCollectionById({
                collectionId
            })
            const updatedCollection: collectionType[] = collectionsList.initial.map(item => {
                if (item._id === data.collection._id) {
                    return data.collection
                }
                return item
            })
            setCollectionsList({
                initial: updatedCollection,
                filtered: filterCollectionsTable({
                    collections: updatedCollection,
                    filterSearch: filterSearch.value
                })
            })
            dispatch(setLikedCollection({ likedCollection: data.likedCollection }))
        } catch (error) {
            setAxiosError(error)
        }
    }

    const collectionUnlike = async (collectionId: string) => {
        if (!collectionsList.initial) return
        try {
            const { data } = await api.getUnlikeCollectionById({
                collectionId
            })
            const updatedCollection: collectionType[] = collectionsList.initial.map(item => {
                if (item._id === data.collection._id) {
                    return data.collection
                }
                return item
            })
            setCollectionsList({
                initial: updatedCollection,
                filtered: filterCollectionsTable({
                    collections: updatedCollection,
                    filterSearch: filterSearch.value
                })
            })
            dispatch(setLikedCollection({ likedCollection: data.likedCollection }))
        } catch (error) {
            setAxiosError(error)
        }
    }

    useEffect(() => {
        getCollections()
    }, [])

    return (
        <ITContentBox style={{ width: '100%' }}>
            <Flex vertical={true} gap={8}>
                <Flex align={'center'}>
                    <Typography.Title style={{ flexGrow: 1 }} level={2}>
                        {`${t('My collections')}`}
                    </Typography.Title>
                    <Button
                        size={'large'}
                        type={'primary'}
                        onClick={() => navigateTo('/newCollection')}
                    >
                        {t('Create collection')}
                    </Button>
                </Flex>
                <CollectionSearchFilter
                    filterSearch={filterSearch}
                    setFilterSearch={setFilterSearch}
                    setCollectionsList={setCollectionsList}
                    collectionsList={collectionsList}
                />
                <Table
                    dataSource={collectionsList.filtered}
                    loading={isLoading}
                    columns={collectionsTableConfig({
                        t,
                        deleteCollection,
                        navigateTo,
                        getUnlike: collectionUnlike,
                        getLike: collectionLike,
                    })}
                    rowKey={'_id'}
                    expandable={{
                        expandedRowRender: (record) => <Markdown>{record?.description}</Markdown>
                    }}
                />
            </Flex>
        </ITContentBox>
    )
}

export default MyCollections