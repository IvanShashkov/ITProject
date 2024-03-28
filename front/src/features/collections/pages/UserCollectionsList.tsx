import {useTranslation} from "react-i18next"
import {useNavigateTo} from "@/hooks/useNavigateTo.ts"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {useDispatch} from "react-redux"

import {
    Flex,
    Table,
    Typography
} from "antd"
import ITContentBox from "@/components/ITContentBox.tsx"
import ITLoader from "@/components/ITLoader.tsx"
import CollectionSearchFilter from "@/features/collections/components/CollectionSearchFilter.tsx"
import Markdown from "react-markdown"

import {initialInput} from "@/defaults/contants.ts"
import {filterCollectionsTable} from "@/features/collections/utils/filterCollectionsTable.ts"
import collectionsTableConfig from "@/features/collections/components/tables/collectionsTableConfig.tsx"

import api from "@/features/collections/api.ts"
import {authApi} from "@/features/auth/api.ts"
import setAxiosError from "@/plugins/setAxiosError.ts"

import {collectionsList, collectionType} from "@/features/collections/types/collectionType.ts"
import {setLikedCollection, userProps} from "@/store/slice/initial.ts"

const UserCollectionsList = () => {
    const { t } = useTranslation()
    const navigateTo = useNavigateTo()
    const dispatch = useDispatch()
    const params = useParams()

    const [user, setUser] = useState<userProps | undefined>(undefined)

    const [filterSearch, setFilterSearch] = useState(initialInput)
    const [collectionsList, setCollectionsList] = useState<collectionsList>({
        initial: undefined,
        filtered: undefined,
    })

    const [isLoading, setIsLoading] = useState(false)
    const [initialIsLoading, setInitialIsLoading] = useState(false)

    const getUser = async () => {
        setInitialIsLoading(true)
        try {
            if (!params.userId) return
            const { data } = await authApi.getUserById({ userId: params.userId })
            setUser(data.user)
        } catch (error) {
            setAxiosError(error)
        } finally {
            setInitialIsLoading(false)
        }
    }

    const getCollections = async () => {
        setIsLoading(true)
        try {
            if (!params.userId) return
            const { data } = await api.getUserCollections({ userId: params.userId })
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
            if (!params.userId) return
            await api.deleteCollectionById({
                collectionId
            })
            const { data } = await api.getUserCollections({ userId: params.userId })
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
        getUser()
        getCollections()
    }, [])

    return (
        <>
            {!initialIsLoading &&
                <ITContentBox style={{ width: '100%' }}>
                    <Flex vertical={true} gap={8}>
                        <Flex align={'center'}>
                            <Typography.Title style={{ flexGrow: 1 }} level={2}>
                                {`${t('Collections')} ${user?.username}`}
                            </Typography.Title>
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
                                getLike: collectionLike,
                                getUnlike: collectionUnlike,
                            })}
                            rowKey={'_id'}
                            expandable={{
                                expandedRowRender: (record) => <Markdown>{record?.description}</Markdown>
                            }}
                        />
                    </Flex>
                </ITContentBox>
            }
            {initialIsLoading &&
                <ITLoader/>
            }
        </>
    )
}

export default UserCollectionsList