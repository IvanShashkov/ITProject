import {
    Button,
    Space,
    Input,
} from "antd"
import { CloseOutlined } from "@ant-design/icons"

import ItemMenuPopover from "@/features/collections/components/ItemMenuPopover.tsx";

import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {
    createCollectionItems,
    createCollectionFields
} from "@/features/collections/types/collectionType.ts"

import {TFunction} from "i18next"
import {getFieldTypeIcon} from "@/features/collections/utils/getFieldTypeIcon.tsx";
import CollectionDataCell from "@/features/collections/components/CollectionDataCell.tsx";

type configProps = {
    fields: createCollectionFields[],
    currItems: createCollectionItems[],
    setItems: Dispatch<SetStateAction<createCollectionItems[]>>,
    deleteFieldHandle: (arg0: number) => void,
    onChangeField: (arg0: number, arg1: ChangeEvent<HTMLInputElement>) => void,
    t: TFunction
}

type columnType = {
    title?: () => JSX.Element | undefined,
    align?: 'right' | 'center',
    render: (_: undefined, row: createCollectionItems) => JSX.Element | undefined,
}

const collectionCreateTableConfig = ({ fields, deleteFieldHandle, onChangeField, t, setItems, currItems }: configProps) => {
    const res: columnType[] = []

    for (let i = 0; i < fields.length ; i++) {
        const currField = fields[i]
        res.push({
            title: () => (
                <Space.Compact>
                    <Input
                        prefix={getFieldTypeIcon(currField.type)}
                        size={'small'}
                        value={t(currField.title)}
                        status={currField.status}
                        onChange={(event) => onChangeField(i, event)}
                    />
                    <Button
                        size={'small'}
                        onClick={() => deleteFieldHandle(i)}
                        disabled={fields.length <= 1}
                    >
                        <CloseOutlined/>
                    </Button>
                </Space.Compact>
            ),
            render: (_, row) => (
                <CollectionDataCell currCell={row.fields[i]}/>
            )
        })
    }

    res.push({
        align: 'right',
        render: (_, row) => (
            <ItemMenuPopover
                item={row}
                currItems={currItems}
                setItems={setItems}
                fields={fields}
            />
        )
    })

    return res
}

export default collectionCreateTableConfig