import {
    Button,
    Divider,
    Flex,
    Table,
    Typography
} from "antd"
import {LikeOutlined} from "@ant-design/icons"
import ITContentBox from "@/components/ITContentBox.tsx"
import ITLoader from "@/components/ITLoader.tsx"
import ITGrayBox from "@/components/ITGrayBox.tsx"
import CollectionComments from "@/features/collections/components/CollectionComments.tsx"
import CollectionMenuPopover from "@/features/collections/components/CollectionMenuPopover.tsx"
import Markdown from "react-markdown"

import {useTranslation} from "react-i18next"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {useNavigateTo} from "@/hooks/useNavigateTo.ts"
import {useDispatch, useSelector} from "react-redux"

import setAxiosError from "@/plugins/setAxiosError.ts"
import {setLikedCollection} from "@/store/slice/initial.ts"

import collectionViewTableConfig from "@/features/collections/components/tables/collectionViewTableConfig.tsx";

import {hasLike} from "@/features/collections/utils/hasLike.ts"

import {collectionType} from "@/features/collections/types/collectionType.ts"
import {RootState} from "@/store/store.ts"
import collectionsApi from "@/features/collections/api.ts"
import api from "@/features/collections/api.ts"

const CollectionView = () => {
    const { t } = useTranslation()
    const params = useParams()
    const navigateTo = useNavigateTo()
    const dispatch = useDispatch()

    const likedCollection = useSelector<RootState>(state => state.initial.likedCollection)
    const [collection, setCollection] = useState<collectionType | undefined>(undefined)

    const [isLoading, setIsLoading] = useState(false)
    const [likeLoading, setLikeLoading] = useState(false)

    const hasLikeCollection = hasLike(likedCollection, collection)

    const getCollection = async () => {
        setIsLoading(true)
        try {
            const { data: collection } = await collectionsApi.getCollectionById({
                collectionId: params.collectionId
            })
            setCollection(collection)
        } catch (error) {
            setAxiosError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteCollection = async () => {
        try {
            await collectionsApi.deleteCollectionById({
                collectionId: params.collectionId
            })
            navigateTo('/collections')
        } catch (error) {
            setAxiosError(error)
        }
    }

    const likeCollection = async () => {
        if (!params.collectionId) return
        setLikeLoading(true)
        try {
            const { data } = await api.getLikeCollectionById({
                collectionId: params.collectionId
            })

            setCollection(data.collection)
            dispatch(setLikedCollection({ likedCollection: data.likedCollection }))
        } catch (error) {
            setAxiosError(error)
        } finally {
            setLikeLoading(false)
        }
    }

    const unlikeCollection = async () => {
        if (!params.collectionId) return
        setLikeLoading(true)
        try {
            const { data } = await api.getUnlikeCollectionById({
                collectionId: params.collectionId
            })

            setCollection(data.collection)
            dispatch(setLikedCollection({ likedCollection: data.likedCollection }))
        } catch (error) {
            setAxiosError(error)
        } finally {
            setLikeLoading(false)
        }
    }

    const likeAction = () => {
        if (hasLikeCollection) {
            return unlikeCollection()
        }
        return likeCollection()
    }

    useEffect(() => {
        getCollection()
    }, [params.collectionId])

    return (
        <>
            {!isLoading && collection &&
                <ITContentBox style={{ width: '100%' }}>
                    <Flex vertical={true}>
                        <Flex
                            align={'center'}
                            gap={16}
                        >
                            <Typography.Title style={{ flexGrow: 1 }} level={2}>
                                {collection.name}
                            </Typography.Title>
                            <Flex
                                style={{ alignItems: 'center' }}
                                gap={8}
                            >
                                <Button
                                    shape={'circle'}
                                    disabled={likeLoading}
                                    type={hasLikeCollection ? 'primary' : 'default'}
                                    onClick={likeAction}
                                >
                                    <LikeOutlined />
                                </Button>
                                <Typography.Text strong={true} >
                                    {collection.likes}
                                </Typography.Text>
                            </Flex>
                            <CollectionMenuPopover
                                collection={collection}
                                deleteCollection={deleteCollection}
                            >
                                <Button
                                    size={'large'}
                                    type={'primary'}
                                >
                                    {t('Actions')}
                                </Button>
                            </CollectionMenuPopover>
                        </Flex>
                        <ITGrayBox style={{ width: '100%' }}>
                            <Typography>
                                <Markdown>
                                    {collection.description}
                                </Markdown>
                            </Typography>
                        </ITGrayBox>
                        <Divider/>
                        <Table
                            columns={collectionViewTableConfig({ fields: collection.fields, t })}
                            dataSource={collection.items}
                            rowKey={'id'}
                        />
                    </Flex>

                    <Divider/>

                    <CollectionComments
                        collectionId={`${params.collectionId}`}
                    />
                </ITContentBox>
            }

            {isLoading &&
                <ITLoader/>
            }
        </>
    )
}

export default CollectionView