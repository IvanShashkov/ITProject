import { Typography } from "antd"

import {collectionType} from "@/features/collections/types/collectionType.ts"

import {TFunction} from "i18next"

import dayjs from "dayjs"

type columnType = {
    title?: () => JSX.Element | undefined,
    render: (arg0: undefined, arg1: collectionType) => JSX.Element | undefined,
    align?: 'right' | 'center'
}

type collectionsTableConfigProps = {
    t: TFunction,
    navigateTo: (arg0: string) => void,
}

const collectionsTableConfigWithoutActions = ({ t, navigateTo }: collectionsTableConfigProps): columnType[] => {
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
            render: (_: undefined, row: collectionType) => <Typography>{dayjs(row.createdDate).format('DD.MM.YYYY')}</Typography>
        },
        {
            title: () => <Typography>{t('Items')}</Typography>,
            render: (_: undefined, row: collectionType) => <Typography>{row.items.length}</Typography>
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
            )
        },
    ]
}

export default collectionsTableConfigWithoutActions