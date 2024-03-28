import {createCollectionItems, createCollectionFields} from "@/features/collections/types/collectionType.ts"
import {Dispatch, SetStateAction, useState} from "react"

import {
    Button,
    Flex,
    Popover,
} from "antd"
import {DeleteOutlined, EditOutlined, MoreOutlined} from "@ant-design/icons"
import EditItemModal from "@/features/collections/components/EditItemModal.tsx"

import {useTranslation} from "react-i18next"


type ItemMenuPopoverProps = {
    item: createCollectionItems,
    currItems: createCollectionItems[],
    setItems: Dispatch<SetStateAction<createCollectionItems[]>>
    fields: createCollectionFields[]
}
const ItemMenuPopover = ({ item, currItems, setItems, fields }: ItemMenuPopoverProps) => {
    const { t } = useTranslation()

    const [openPopover, setOpenPopover] = useState(false)
    const [openEditItemModal, setOpenEditItemModal] = useState(false)

    const deleteItem = () => {
        const updatedItems = currItems.filter(currItem => currItem.id !== item.id)
        setItems(updatedItems)
    }

    const onOpenHandle = (newOpen: boolean) => {
        setOpenPopover(newOpen)
    }

    const popoverContent = (
        <Flex vertical={true} gap={4}>
            <Button
                icon={ <EditOutlined /> }
                onClick={() => {
                    setOpenEditItemModal(true)
                    setOpenPopover(false)
                }}
            >
                {t('Edit')}
            </Button>
            <Button
                danger={true}
                icon={ <DeleteOutlined /> }
                onClick={() => {
                    deleteItem()
                    setOpenPopover(false)
                }}
            >
                {t('Delete')}
            </Button>
        </Flex>
    )

    return (
        <>
            <Popover
                content={popoverContent}
                open={openPopover}
                trigger={'click'}
                onOpenChange={onOpenHandle}
            >
                <Button
                    shape="circle"
                >
                    <MoreOutlined />
                </Button>
            </Popover>
            {openEditItemModal &&
                <EditItemModal
                    open={openEditItemModal}
                    item={item}
                    currItems={currItems}
                    setItems={setItems}
                    type={'edit'}
                    setOpenModal={setOpenEditItemModal}
                    fields={fields}
                />
            }
        </>
    )
}

export default ItemMenuPopover