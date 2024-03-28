import {Skeleton, Space, Typography} from "antd"
import dayjs from "dayjs"

import {
    collectionDataFields,
    createCollectionDataFields
} from "@/features/collections/types/collectionType.ts"

const CollectionDataCell = ({ currCell }: { currCell: createCollectionDataFields | collectionDataFields}) => {
    if (!currCell.value) {
        return <Space><Skeleton.Input size={'small'}/></Space>
    }
    if (currCell.type === 'date') {
        return <Typography>{dayjs(currCell.value).format('DD.MM.YYYY')}</Typography>
    }
    if (typeof currCell.value === 'string' || typeof currCell.value === 'number') {
        return <Typography>{currCell.value}</Typography>
    }
}

export default CollectionDataCell