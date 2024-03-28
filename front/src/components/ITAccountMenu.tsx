import {Button, Dropdown, MenuProps} from "antd"
import {
    FrownOutlined,
    UserOutlined,
    UsergroupAddOutlined,
    HddOutlined,
    HeartOutlined,
} from "@ant-design/icons"

import {logout} from "@/store/slice/initial.ts"
import {hasRole} from "@/plugins/hasRole.ts"

import {useNavigateTo} from "@/hooks/useNavigateTo.ts"
import {useTranslation} from "react-i18next"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "@/store/store.ts"

const ITAccountMenu = () => {
    const dispatch = useDispatch()
    const navigateTo = useNavigateTo()
    const { t } = useTranslation()

    const userRole  = useSelector<RootState>((state) => state.initial.user.role)
    const userUsername  = useSelector<RootState>((state) => state.initial.user.username)

    const getMenuOptions = () => {
        if (!userUsername) {
            return []
        }

        const items :MenuProps['items'] = [
            {
                key: 1,
                label: t('My collections'),
                onClick: () => {
                    navigateTo(`/myCollections`)
                },
                icon: <HddOutlined />,
            },
            {
                key: 2,
                label: t('Liked collections'),
                onClick: () => {
                    navigateTo(`/likedCollections`)
                },
                icon: <HeartOutlined />,
            },
            {
                key: 3,
                label: t('Quit'),
                onClick: () => {
                    dispatch(logout())
                    navigateTo('/')
                },
                icon: <FrownOutlined />,
            },
        ]
        if (hasRole(userRole, 'admin')) {
            items.unshift({
                key: 4,
                label: t('Admin'),
                onClick: () => navigateTo('/admin'),
                icon: <UsergroupAddOutlined />,
            })
        }

        return items
    }

    return (
        <>
            {!userUsername &&
                <Button onClick={() => navigateTo('/registration')}>
                    Sing in
                </Button>
            }
            {userUsername &&
                <Dropdown
                    placement={'bottom'}
                    menu={{ items: getMenuOptions() }}
                >
                    <Button icon={<UserOutlined />}>
                        {userUsername.toString()}
                    </Button>
                </Dropdown>
            }
        </>
    )
}

export default ITAccountMenu