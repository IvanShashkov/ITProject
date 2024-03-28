import {collectionType} from "@/features/collections/types/collectionType.ts"

import {
    Flex,
    Table,
    Typography
} from "antd"
import ITContentBox from "@/components/ITContentBox.tsx"
import Markdown from "react-markdown"

import {useTranslation} from "react-i18next"
import {useNavigateTo} from "@/hooks/useNavigateTo.ts"
import {useEffect, useState} from "react"

import setAxiosError from "@/plugins/setAxiosError.ts"
import collectionsApi from "@/features/collections/api.ts"

import collectionsTableConfigWithoutActions from "@/features/collections/components/tables/collectionsTableConfigWithoutActions.tsx"

const MainPage = () => {
    const { t } = useTranslation()
    const navigateTo = useNavigateTo()

    const [ mostLikedCollections, setMostLikedCollections ] = useState<collectionType[] | undefined>(undefined)
    const [ biggestCollections, setBiggestCollections ] = useState<collectionType[] | undefined>(undefined)
    const [ isLoading, setIsLoading ] = useState(false)

    const getCollections = async () => {
        setIsLoading(true)
        try {
            const { data: { collections } }: { data: { collections: collectionType[] } } = await collectionsApi.getCollections()

            const mostLikedCollections = [...collections].sort((a, b) => b.likes - a.likes)
            const biggestCollection = [...collections].sort((a, b) => b.items.length - a.items.length)

            setMostLikedCollections(mostLikedCollections.filter((_, index) => index < 5))
            setBiggestCollections(biggestCollection.filter((_, index) => index < 5))
        } catch (error) {
            setAxiosError(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCollections()
    }, [])

    return (
        <Flex
            vertical={true}
            gap={24}
            style={{ width: '100%' }}
        >
            <ITContentBox>
                <Typography.Title level={3}>
                    {t(`Popular collections`)}
                </Typography.Title>
                <Table
                    columns={collectionsTableConfigWithoutActions({
                        t,
                        navigateTo,
                    })}
                    dataSource={mostLikedCollections}
                    loading={isLoading}
                    rowKey={'_id'}
                    pagination={false}
                    expandable={{
                        expandedRowRender: (record) => <Markdown>{record?.description}</Markdown>
                    }}
                />
            </ITContentBox>
            <ITContentBox>
                <Typography.Title level={3}>
                    {t(`Biggest collections`)}
                </Typography.Title>
                <Table
                    columns={collectionsTableConfigWithoutActions({
                        t,
                        navigateTo,
                    })}
                    dataSource={biggestCollections}
                    rowKey={'_id'}
                    loading={isLoading}
                    pagination={false}
                    expandable={{
                        expandedRowRender: (record) => <Markdown>{record?.description}</Markdown>
                    }}
                />
            </ITContentBox>
        </Flex>
    )
}

export default MainPage