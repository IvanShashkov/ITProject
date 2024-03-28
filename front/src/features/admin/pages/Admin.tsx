import {
    Button,
    Flex,
    Input,
    Space,
    Table,
    Select,
} from "antd"
import {
    DeleteOutlined,
    DislikeOutlined,
    LikeOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
    SearchOutlined,
    CloseOutlined,
} from "@ant-design/icons"
import ITContentBox from "@/components/ITContentBox.tsx"

import {Key, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"

import adminTableConfig from "@/features/admin/components/adminTableConfig.tsx"
import {filterUsersTable} from "@/features/admin/utils/filterUsersTable.ts"

import {initialInput} from "@/defaults/contants.ts"
import {userProps} from "@/store/slice/initial.ts"

import {
    getAdmin,
    getBan,
    getDelete,
    getUnban,
    getUsers,
    removeAdmin
} from "@/features/admin/utils/req.ts"

export type usersList = {
    initial: userProps[] | undefined,
    filtered: userProps[] | undefined,
    selected: Key[],
}

const Admin = () => {
    const { t } = useTranslation()

    const [usersList, setUsersList] = useState<usersList>({
        initial: undefined,
        filtered: undefined,
        selected: []
    })

    const [isLoading, setIsLoading] = useState(false)
    const [filterSearch, setFilterSearch] = useState(initialInput)
    const [filterSelect, setFilterSelect] = useState<'_id' | 'username'>('_id')
    const selectionOnChange = (selectedRowKeys: Key[]) => {
        setUsersList({ ...usersList, selected: selectedRowKeys })
    }
    const actionButtonDisabled = () => usersList.selected?.length <= 0 || isLoading
    const filterDisabled = () => {
        if (!usersList.initial) {
            return true
        }
        return usersList.initial.length <= 0
    }

    const setFilter = () => {
        setUsersList({
            ...usersList,
            filtered: filterUsersTable({
                filterSearch: filterSearch.value,
                filterSelect,
                data: usersList.initial
            }),
            selected: [],
        })
    }

    const clearFilter = () => {
        setFilterSearch(initialInput)
        setUsersList({
            ...usersList,
            filtered: usersList.initial,
            selected: [],
        })
    }

    const reqPayload = {
        setUsersList,
        setIsLoading,
        filterSelect,
        filterSearch: filterSearch.value,
        selected: usersList.selected
    }

    useEffect(() => {
        getUsers({ setIsLoading, setUsersList })
    }, [])


    const buttons = [
        {
            key: 'buttons_1',
            label: t('Ban'),
            onClick: () => getBan(reqPayload),
            icon: <DislikeOutlined />,
        },
        {
            key: 'buttons_2',
            label: t('Unban'),
            onClick: () => getUnban(reqPayload),
            icon: <LikeOutlined />,
        },
        {
            key: 'buttons_3',
            label: t('Delete'),
            onClick: () => getDelete(reqPayload),
            icon: <DeleteOutlined />,
        },
        {
            key: 'buttons_4',
            label: t('Get admin'),
            onClick: () => getAdmin(reqPayload),
            icon: <UserAddOutlined />,
        },
        {
            key: 'buttons_5',
            label: t('Remove admin'),
            onClick: () => removeAdmin(reqPayload),
            icon: <UserDeleteOutlined />,
        },
    ]

    const selectOptions = [
        {
            label: t('ID'),
            value: '_id'
        },
        {
            label: t('Username'),
            value: 'username',
        },
    ]

    return (
        <ITContentBox style={{ width: '100%'}} >
            <Flex
                vertical={true}
                gap={12}
            >
                <Flex
                    gap={8}
                    justify={'center'}
                >
                    <Space.Compact>
                        <Select
                            size={'large'}
                            value={filterSelect}
                            onChange={(value) => setFilterSelect(value)}
                            options={selectOptions}
                        />
                        <Input
                            size={'large'}
                            value={filterSearch.value}
                            disabled={filterDisabled()}
                            onChange={(event) => {
                                setFilterSearch({ ...filterSearch, value: event.target.value })}
                            }
                        />
                        <Button
                            size={'large'}
                            onClick={setFilter}
                            disabled={filterDisabled() || filterSearch.value.length <= 0}
                        >
                            <SearchOutlined />
                        </Button>
                        <Button
                            size={'large'}
                            onClick={clearFilter}
                            disabled={filterDisabled()}
                        >
                            <CloseOutlined />
                        </Button>
                    </Space.Compact>
                    <Space.Compact>
                        {buttons.map(button => (
                            <Button
                                key={button.key}
                                icon={ button.icon }
                                onClick={button.onClick}
                                disabled={actionButtonDisabled()}
                                size={'large'}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </Space.Compact>
                </Flex>
                <Table
                    columns={adminTableConfig({ t })}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: usersList.selected,
                        onChange: selectionOnChange,
                    }}
                    dataSource={usersList.filtered}
                    loading={isLoading}
                    rowKey={'_id'}
                />
            </Flex>
        </ITContentBox>
    )
}

export default Admin