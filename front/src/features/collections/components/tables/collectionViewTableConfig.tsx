import { Typography } from "antd"
import CollectionDataCell from "@/features/collections/components/CollectionDataCell.tsx"

import {collectionFields, collectionItems} from "@/features/collections/types/collectionType.ts"
import {TFunction} from "i18next"

type configProps = {
    fields: collectionFields[],
    t: TFunction,
}

const collectionViewTableConfig = ({ fields, t }: configProps) => {
    const res = []

    for (let i = 0; i < fields.length ; i++) {
        const currField = fields[i]
        res.push({
            title: () => <Typography>{t(currField.title)}</Typography>,
            render: (_: undefined, row: collectionItems) => (
                <CollectionDataCell currCell={row.fields[i]}/>
            )
        })
    }

    return res
}

export default collectionViewTableConfig