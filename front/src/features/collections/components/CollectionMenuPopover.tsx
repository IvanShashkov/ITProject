import {useTranslation} from "react-i18next"
import {useState} from "react"
import {useSelector} from "react-redux"
import {useNavigateTo} from "@/hooks/useNavigateTo.ts"

import {collectionType} from "@/features/collections/types/collectionType.ts"
import {RootState} from "@/store/store.ts"

import {
    Button,
    Flex,
    Popover
} from "antd"
import {DeleteOutlined, DownloadOutlined, EditOutlined} from "@ant-design/icons"

import CsvDownload from "react-csv-downloader"
import {csvPrepareData, csvPrepareHeader} from "@/features/collections/types/csvPrepare.ts"
import {hasRole} from "@/plugins/hasRole.ts"

type CollectionMenuPopoverProps = {
    children: any,
    collection: collectionType,
    deleteCollection: (arg0: string) => void
}

const CollectionMenuPopover = ({ children, collection, deleteCollection }: CollectionMenuPopoverProps) => {
    const { t } = useTranslation()
    const navigateTo = useNavigateTo()

    const [openPopover, setOpenPopover] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const userId = useSelector<RootState>(state => state.initial.user._id)
    const userRoles = useSelector<RootState>(state => state.initial.user.role)

    const deleteCollectionHandle = async () => {
        setIsLoading(true)
        await deleteCollection(collection._id)
        setIsLoading(false)
    }

    const onOpenHandle = (newOpen: boolean) => {
        setOpenPopover(newOpen)
    }

    const popoverContent = (
        <Flex vertical={true} gap={4}>
            {userId === collection.userId || hasRole(userRoles, 'admin') &&
                <>
                    <Button
                        disabled={isLoading}
                        icon={ <EditOutlined /> }
                        onClick={() => {
                            navigateTo(`/editCollection/${collection._id}`)
                            setOpenPopover(false)
                        }}
                    >
                        {t('Edit')}
                    </Button>
                    <Button
                        danger={true}
                        icon={ <DeleteOutlined /> }
                        disabled={isLoading}
                        onClick={async () => {
                            await deleteCollectionHandle()
                            setOpenPopover(false)
                        }}
                    >
                        {t('Delete')}
                    </Button>
                </>
            }
            <CsvDownload
                style={{ width: '100%' }}
                filename={collection.name}
                datas={csvPrepareData(collection.fields, collection.items)}
                columns={csvPrepareHeader(collection.fields)}
                extension=".csv"
                separator=";"
                wrapColumnChar="'"
            >
                <Button
                    onClick={() => setOpenPopover(false)}
                    disabled={isLoading}
                    icon={ <DownloadOutlined /> }
                    style={{ width: '100%' }}
                >
                    {t('Export')}
                </Button>
            </CsvDownload>
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
                {children}
            </Popover>
        </>
    )
}

export default CollectionMenuPopover