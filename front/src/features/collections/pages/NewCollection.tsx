import {
    Button,
    Dropdown,
    Flex,
    Input,
    Space,
    Table,
    Typography
} from "antd"
import {
    PlusOutlined,
    SaveOutlined,
    SubnodeOutlined
} from "@ant-design/icons"
import ITContentBox from "@/components/ITContentBox.tsx"
import ITLoader from "@/components/ITLoader.tsx"
import EditItemModal from "@/features/collections/components/EditItemModal.tsx"

import {useTranslation} from "react-i18next"
import {useNavigateTo} from "@/hooks/useNavigateTo.ts"
import {useParams} from "react-router-dom"
import {ChangeEvent, useEffect, useState} from "react"
import setAxiosError from "@/plugins/setAxiosError.ts"
import {enqueueSnackbar} from "notistack"

import {
    createCollectionItems,
    createCollectionFields,
    collectionItems
} from "@/features/collections/types/collectionType.ts"
import collectionsApi, {createCollectionProps} from "@/features/collections/api.ts"

import collectionCreateTableConfig from "@/features/collections/components/tables/collectionsCreateTableConfig.tsx"
import {initialInput} from "@/defaults/contants.ts"

import {getInitialField} from "@/features/collections/data/getInitialCollectionsFields.ts"
import {getFieldTypeIcon} from "@/features/collections/utils/getFieldTypeIcon.tsx"
import {
    getInitialNewItem,
    getTitlePage,
    prepareCollectionFieldsToFront,
    prepareCollectionFieldsToReq,
    prepareItemDataFieldsToFront,
    prepareItemDataFieldsToReq
} from "@/features/collections/utils/newCollectionUtils.ts"

const NewCollection = ({ type }: { type: 'edit' | 'create' }) => {
    const maxFields = 7
    const maxItems = 50

    const params = useParams()
    const { t } = useTranslation()
    const navigateTo = useNavigateTo()

    const [editModalOpen, setEditModalOpen] = useState(false)

    const [name, setName] = useState(initialInput)
    const [description, setDescription] = useState(initialInput)
    const [isLoading, setIsLoading] = useState(false)
    const [initialIsLoading, setInitialIsLoading] = useState(false)

    const [fields, setFields] = useState(getInitialField())
    const [items, setItems] = useState<createCollectionItems[]>([])

    const onChangeField = (fieldIndex: number, event: ChangeEvent<HTMLInputElement>) => {
        const updatedFields: createCollectionFields[] = fields.map((field, index) => {
            if (index !== fieldIndex) {
                return field
            }
            if (event.target.value.length > 20) {
                return field
            }
            field.title = event.target.value
            field.status = undefined
            return field
        })
        setFields(updatedFields)
    }

    const deleteFieldHandle = (fieldIndex: number) => {
        const updatedFields = fields.filter((_, index) => index !== fieldIndex)
        const updatedItems = items.map(item => (
            {...item, fields: item.fields.filter((_, index) => fieldIndex !== index)}
        ))
        setItems(updatedItems)
        setFields(updatedFields)
    }

    const getNewField = (type: 'string' | 'date' | 'number') => {
        const updateFields: createCollectionFields[] = [...fields, { title: `Field ${type}`, type: type, status: undefined }]
        const updatedItems : createCollectionItems[] = items.map(item => ({
            ...item,
            fields: [
                ...item.fields,
                { value: '', type, status: undefined },
            ]
        }))
        setFields(updateFields)
        setItems(updatedItems)
    }

    const hasErrorForm = () => {
        let check = false
        if (!name.value) {
            check = true
            setName({...name, status: 'error'})
        }
        if (!description.value) {
            check = true
            setDescription({...description, status: 'error'})
        }
        if (fields.some(field => !field.title)) {
            check = true
            const updatedField: createCollectionFields[] = fields.map(field => {
                if (!field.title) {
                    return {...field, status: 'error'}
                }
                return field
            })
            setFields(updatedField)
        }
        return check
    }

    const actionCollection = async () => {
        if (hasErrorForm()) {
            return
        }
        const payload: createCollectionProps = {
            fields: prepareCollectionFieldsToReq(fields),
            name: name.value,
            items: items.map(item => ({...item, fields: prepareItemDataFieldsToReq(item.fields)})),
            description: description.value
        }
        setIsLoading(true)
        try {
            if (type === 'create') {
                await collectionsApi.createCollection(payload)
                navigateTo('/collections')
            }
            if (type === 'edit') {
                if (!params.collectionId) return
                await collectionsApi.editCollection({ ...payload, collectionId: params?.collectionId })
                navigateTo(`/collection/${params?.collectionId}`)
            }
        } catch (error) {
            setAxiosError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getInitialEditCollection = async () => {
        if (!params?.collectionId) {
            enqueueSnackbar(t('Loading collection data error'), {
                variant: 'error'
            })
            return
        }

        setInitialIsLoading(true) 
        try {
            const { data: collection } = await collectionsApi.getCollectionById({ 
                collectionId: params?.collectionId 
            })
            const updatedItems = collection.items.map((item: collectionItems) => ({
                ...item, fields: prepareItemDataFieldsToFront(item.fields)
            }))
            const updatedCollectionFields = prepareCollectionFieldsToFront(collection.fields)

            setName({...name, value: collection.name})
            setDescription({...description, value: collection.description})
            setItems(updatedItems)
            setFields(updatedCollectionFields)
        } catch (error) {
            setAxiosError(error)
        } finally {
            setInitialIsLoading(false)
        }
    }

    useEffect(() => {
        if (type === 'edit') {
            getInitialEditCollection()
        }
    }, [])

    const fieldButtonItems = [
        {
            label: t('Date'),
            onClick: () => getNewField('date'),
            icon: getFieldTypeIcon('date'),
            key: 'date'
        },
        {
            label: t('Number'),
            onClick: () => getNewField('number'),
            icon: getFieldTypeIcon('number'),
            key: 'number'
        },
        {
            label: t('String'),
            onClick: () => getNewField('string'),
            icon: getFieldTypeIcon('string'),
            key: 'string'
        },
    ]

    return (
        <>
            {!initialIsLoading && (
                <ITContentBox style={{ width: '100%' }}>
                    <Typography.Title level={2}>
                        {t(`${getTitlePage(type)}`)}
                    </Typography.Title>
                    <Flex gap={16} align={'center'} vertical={true}>
                        <Input
                            value={name.value}
                            status={name.status}
                            placeholder={t('Name')}
                            disabled={isLoading}
                            size={'large'}
                            onChange={event => {
                                if (event.target.value.length > 25) {
                                    return
                                }
                                setName({ value: event.target.value, status: undefined })}
                            }
                        />
                        <Input.TextArea
                            value={description.value}
                            rows={4}
                            disabled={isLoading}
                            status={description.status}
                            placeholder={t('Description')}
                            size={'large'}
                            onChange={event => {
                                if (event.target.value.length > 800) {
                                    return
                                }
                                setDescription({ value: event.target.value, status: undefined })}
                            }
                        />
                        <Space.Compact>
                            <Dropdown
                                trigger={['click']}
                                menu={{ items: fieldButtonItems }}
                                placement={'top'}
                                disabled={fields.length >= maxFields || isLoading}
                            >
                                <Button
                                    size={'large'}
                                    type={'primary'}
                                    icon={ <PlusOutlined /> }
                                >
                                    {t('Get new field')}
                                </Button>
                            </Dropdown>
                            <Button
                                size={'large'}
                                icon={ <SubnodeOutlined /> }
                                disabled={items.length >= maxItems || isLoading}
                                onClick={() => {
                                    if (hasErrorForm()) {
                                        return
                                    }
                                    setEditModalOpen(true)
                                }}
                            >
                                {t('Get new item')}
                            </Button>
                        </Space.Compact>
                        <Table
                            style={{ width: '100%' }}
                            loading={isLoading}
                            rowKey={'id'}
                            columns={
                                collectionCreateTableConfig({
                                    fields,
                                    deleteFieldHandle,
                                    onChangeField,
                                    currItems: items,
                                    setItems: setItems,
                                    t,
                                })
                            }
                            pagination={false}
                            dataSource={items}
                        />
                        <Button
                            size={'large'}
                            type={'dashed'}
                            disabled={isLoading}
                            icon={ <SaveOutlined /> }
                            onClick={actionCollection}
                        >
                            {t(`${getTitlePage(type)}`)}
                        </Button>
                    </Flex>
                    {editModalOpen &&
                        <EditItemModal
                            open={editModalOpen}
                            item={getInitialNewItem(fields, items.length + 1)}
                            currItems={items}
                            setItems={setItems}
                            type={'add'}
                            setOpenModal={setEditModalOpen}
                            fields={fields}
                        />
                    }
                </ITContentBox>
            )}
            {initialIsLoading && (
                <ITLoader/>
            )}
        </>
    )
}

export default NewCollection