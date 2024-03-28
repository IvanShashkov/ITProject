import {Button, Flex, Typography} from "antd"
import {MoreOutlined} from "@ant-design/icons"
import CollectionMenuPopover from "@/features/collections/components/CollectionMenuPopover.tsx"

import {collectionType} from "@/features/collections/types/collectionType.ts"

import {TFunction} from "i18next"

import dayjs from "dayjs"
import CollectionLike from "@/features/collections/components/CollectionLike.tsx";

type columnType = {
    title?: () => JSX.Element | undefined,
    render: (arg0: undefined, arg1: collectionType) => JSX.Element | undefined,
    align?: 'right' | 'center'
    sorter?: (arg0: collectionType, arg1: collectionType) => number
}

type collectionsTableConfigProps = {
    t: TFunction,
    deleteCollection: (arg0: string) => void,
    getLike: (arg0: string) => void,
    getUnlike: (arg0: string) => void,
    navigateTo: (arg0: string) => void,
}

const collectionsTableConfig = ({ t, deleteCollection, navigateTo, getLike, getUnlike }: collectionsTableConfigProps): columnType[] => {
    return [
        {
            title: () => <Typography>{t('Name')}</Typography>,
            render: (_: undefined, row: collectionType) => (
                <Typography.Link
                    onClick={() => navigateTo(`/collection/${row._id}`)}
                >
                    {row.name}
                </Typography.Link>
            )
        },
        {
            title: () => <Typography>{t('Created')}</Typography>,
            render: (_: undefined, row: collectionType) => <Typography>{dayjs(row.createdDate).format('DD.MM.YYYY')}</Typography>,
            sorter: (a, b) => dayjs(a.createdDate).unix() - dayjs(b.createdDate).unix()
        },
        {
            title: () => <Typography>{t('Items')}</Typography>,
            render: (_: undefined, row: collectionType) => <Typography>{row.items.length}</Typography>,
            sorter: (a, b) => a.items.length - b.items.length
        },
        {
            title: () => <Typography>{t('User')}</Typography>,
            render: (_: undefined, row: collectionType) => (
                <Typography.Link
                    onClick={() => navigateTo(`/userCollection/${row.userId}`)}
                >
                    {row.username}
                </Typography.Link>
            )
        },
        {
            title: () => <Typography>{t('Likes')}</Typography>,
            render: (_: undefined, row: collectionType) => (
                <Typography>
                    {row.likes}
                </Typography>
            ),
            sorter: (a, b) => a.likes - b.likes
        },
        {
            align: 'right',
            render: (_: undefined, row: collectionType) => (
                <Flex
                    gap={8}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'end'
                    }}
                >
                    <CollectionLike
                        collection={row}
                        getLike={getLike}
                        getUnlike={getUnlike}
                    />
                    <CollectionMenuPopover
                        collection={row}
                        deleteCollection={deleteCollection}
                    >
                        <Button shape="circle">
                            <MoreOutlined />
                        </Button>
                    </CollectionMenuPopover>
                </Flex>
            )
        }
    ]
}

export default collectionsTableConfig