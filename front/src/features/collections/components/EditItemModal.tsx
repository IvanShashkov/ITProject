import {
    createCollectionDataFields,
    createCollectionItems,
    createCollectionFields
} from "@/features/collections/types/collectionType.ts"

import {Dispatch, SetStateAction, useState} from "react"
import {useTranslation} from "react-i18next"

import {
    DatePicker,
    Flex,
    Input,
    Modal,
    Typography,
} from "antd"

import {getFieldTypeIcon} from "@/features/collections/utils/getFieldTypeIcon.tsx"
import dayjs from "dayjs"
import {datePickerLocales} from "@/defaults/datePickerLocales.ts"

type EditItemModalProps = {
    open: boolean,
    item: createCollectionItems,
    currItems: createCollectionItems[],
    setItems: Dispatch<SetStateAction<createCollectionItems[]>>
    type: 'add' | 'edit',
    setOpenModal: Dispatch<SetStateAction<boolean>>,
    fields: createCollectionFields[]
}

const EditItemModal = ({ open, item, currItems, setItems, type, setOpenModal, fields }: EditItemModalProps) => {

    const { i18n, t } = useTranslation()
    const [itemState, setItemState] = useState(item)

    const getTittle = () => {
        if (type === 'add') {
            return t('Add item')
        }
        if (type === 'edit') {
            return (t('Edit item'))
        }
    }

    const onChangeCell = (newData: string | Date, fieldIndex: number) => {
        const updateItem = {
            ...itemState,
            fields: itemState.fields.map((field, index) => {
                if (index === fieldIndex) {
                    return { ...field, value: newData, status: undefined }
                }
                return field
            })
        }
        setItemState(updateItem)
    }

    const hasErrorForm = () => {
        let check = false
        const  updatedField: createCollectionDataFields[] = itemState.fields.map(field => {
            if (!field.value) {
                check = true
                return {...field, status: 'error'}
            }
            return field
        })
        setItemState({...itemState, fields: updatedField})
        return check
    }

    const handleOk = () => {
        if (hasErrorForm()) {
            return
        }

        if (type === 'edit') {
            const updatedItems = currItems.map((item) => {
                if (item.id === itemState.id) {
                    return itemState
                }
                return item
            })
            setItems(updatedItems)
        }
        if (type === 'add') {
            setItems([itemState, ...currItems])
        }
        setOpenModal(false)
    }

    const handleCancel = () => setOpenModal(false)

    return (
        <Modal
            open={open}
            title={getTittle()}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ maxWidth: '350px' }}
        >
            <Flex
                vertical={true}
                gap={12}
            >
                {
                    itemState.fields.map((field, index) => {
                        if (field.type === 'date') {
                            const validatedDate = field.value ? dayjs(`${field.value}`) : undefined
                            return (
                                <Flex
                                    key={index}
                                    vertical={true}
                                    gap={4}
                                >
                                    <Typography>
                                        {t(fields[index].title)}
                                    </Typography>
                                    <DatePicker
                                        locale={datePickerLocales.get(i18n.language)}
                                        status={field.status}
                                        value={validatedDate}
                                        format={'DD.MM.YYYY'}
                                        onChange={(date: Date) => onChangeCell(date, index)}
                                    />
                                </Flex>
                            )
                        }
                        if ((field.type === 'string' || field.type === 'number') && typeof field.value !== 'undefined') {
                            return (
                                <Flex
                                    vertical={true}
                                    gap={4}
                                    key={index}
                                >
                                    <Typography>
                                        {t(fields[index].title)}
                                    </Typography>
                                    <Input
                                        type={field.type}
                                        status={field.status}
                                        size={'small'}
                                        value={t(field.value.toString())}
                                        prefix={getFieldTypeIcon(field.type)}
                                        onChange={(event) => {
                                            if (event.target.value.length > 25) {
                                                return
                                            }
                                            onChangeCell(event.target.value, index)}
                                        }
                                    />
                                </Flex>
                            )
                        }
                    })
                }
            </Flex>
        </Modal>
    )
}

export default EditItemModal