import {
    AutoComplete,
    Flex,
    Input,
    Typography
} from "antd"

import {initialInput} from "@/defaults/contants.ts"
import {collectionType} from "@/features/collections/types/collectionType.ts"
import {commentType} from "@/features/collections/components/CollectionComments.tsx"

import api from "@/api/api.ts"
import setAxiosError from "@/plugins/setAxiosError.ts"

import {useState} from "react"
import {useDebouncedCallback} from "use-debounce"
import {useTranslation} from "react-i18next"
import {useNavigateTo} from "@/hooks/useNavigateTo.ts"
import dayjs from "dayjs";

const ITGlobalSearch = () => {
    const { t } = useTranslation()
    const navigateTo = useNavigateTo()

    const [searchValue, setSearchValue] = useState(initialInput)
    const [collections, setCollections] = useState<collectionType[] | undefined>(undefined)
    const [comments, setComments] = useState<commentType[] | undefined>(undefined)

    const getGlobalSearch = async () => {
        if (!searchValue.value) {
            setCollections([])
            setComments([])
            return
        }
        try {
            const { data: { collections, comments } } = await api.post('/api/getGlobalSearch', { searchValue: searchValue.value })
            setCollections(collections)
            setComments(comments)
        } catch (error) {
            setAxiosError(error)
        }
    }
    const debouncedGetGlobalSearch = useDebouncedCallback(getGlobalSearch, 300)

    const getOptions = () => {
        if (!collections || !comments) return []

        const res = []
        if (collections.length) {
            const collectionsOption = {
                label: t('Collections'),
                options: collections.map(collection => ({
                    label: (
                        <Flex
                            key={collection._id}
                            style={{ justifyContent: 'space-between' }}
                            onClick={() => {
                                navigateTo(`/collection/${collection._id}`)
                            }}
                        >
                            <Typography>{collection.name}</Typography>
                            <Typography.Text
                                type={'secondary'}
                            >
                                {t('Likes')}: {collection.likes}
                            </Typography.Text>
                        </Flex>
                    ),
                }))
            }
            res.push(collectionsOption)
        }
        if (comments.length) {
            const commentsOption = {
                label: t('Comments'),
                options: comments.map(comment => ({
                    label: (
                        <Flex
                            key={comment._id}
                            style={{ justifyContent: 'space-between' }}
                            onClick={() => {
                                navigateTo(`/collection/${comment.collectionId}`)
                            }}
                        >
                            <Typography
                                style={{
                                    whiteSpace: 'nowrap',
                                    maxWidth: '350px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {comment.comment}
                            </Typography>
                            <Typography.Text
                                type={'secondary'}
                            >
                                {dayjs(comment.createdDate).format('DD.MM.YYYY')}
                            </Typography.Text>
                        </Flex>
                    ),
                    onClick: () => {navigateTo(`/collection/${comment.collectionId}`)}
                }))
            }
            res.push(commentsOption)
        }
        return res
    }

    return (
        <AutoComplete
            popupMatchSelectWidth={500}
            style={{ width: 250 }}
            options={getOptions()}
            notFoundContent={<Typography>{t('No results')}</Typography>}
            onDropdownVisibleChange={debouncedGetGlobalSearch}
        >
            <Input
                placeholder={t('Search')}
                value={searchValue.value}
                size={'large'}
                onChange={(event) => {
                    setSearchValue({ value: event.target.value, status: undefined })
                    debouncedGetGlobalSearch()
                }}
            />
        </AutoComplete>
    )
}

export default ITGlobalSearch