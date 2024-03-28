import {
    Flex,
    Layout,
    Menu,
    Select,
    Spin,
    ConfigProvider,
    Switch,
    theme,
} from "antd"
import {
    Outlet,
    useLocation,
    useNavigate,
    useParams,
    useMatches
} from "react-router-dom"

import ITAccountMenu from "@/components/ITAccountMenu.tsx"
import ITErrorBoundary from "@/components/ITErrorBoundary.tsx"
import ITGlobalSearch from "@/components/ITGlobalSearch.tsx"

import {defaultLanguage, languages} from "@/defaults/contants.ts"
import {antdLocales} from "@/defaults/antdLocales.ts"

import {useTranslation} from "react-i18next"
import {useNavigateTo} from "@/hooks/useNavigateTo.ts"
import {useDispatch, useSelector} from "react-redux"
import {useEffect, useState} from "react"

import logo from "../assets/logo.svg"

import {localStorageThemeKey, setTheme, userInit} from "@/store/slice/initial.ts"
import {AppDispatch, RootState} from "@/store/store.ts"

import {withErrorBoundary} from "react-error-boundary"

const ITLayout = () => {
    const navigate = useNavigate()
    const navigateTo = useNavigateTo()
    const { darkAlgorithm, defaultAlgorithm } = theme

    const params = useParams()
    const location = useLocation()
    const matches = useMatches()

    const isLoading = useSelector<RootState>(state => state.initial.isLoading)
    const dispatch = useDispatch<AppDispatch>()


    const getThemeSettings = () => {
        const themeSetting = localStorage.getItem(localStorageThemeKey)
        if (!themeSetting) {
            return true
        }
        return JSON.parse(themeSetting)
    }

    const getChangeLangUrl = (codeLang: string) => {
        if (params?.lang) {
            return location.pathname.replace(params.lang, codeLang)
        }
        return `/${codeLang + location.pathname}`
    }
    const selectedPageKey = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return `${matches[matches.length - 1].handle.crumb().key}`
    }

    const { i18n, t } = useTranslation()
    const initialLanguage = params?.lang ? params?.lang : defaultLanguage
    const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage)
    const lightTheme = useSelector<RootState>(state => state.initial.lightTheme)

    const { Header, Content } = Layout
    const menuItems = [
        {
            key: '/',
            label: t('Main'),
            onClick: () => navigateTo(`/`)
        },
        {
            key: 'collections',
            label: t('Collections'),
            onClick: () => navigateTo(`/collections`)
        }
    ]

    useEffect(() => {
        i18n.changeLanguage(initialLanguage)
        dispatch(userInit({ navigate }))
        dispatch(setTheme({ theme: getThemeSettings() }))
    }, [])

    if (isLoading) {
        return (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,

                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                    width: '100%',
                    height: '100%',
                }}
            >
                <Spin/>
            </div>
        )
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: lightTheme ? defaultAlgorithm : darkAlgorithm
            }}
            locale={antdLocales.get(i18n.language)}
        >
            <Layout>
                <Header>
                    <Flex
                        style={{ alignItems: 'center' }}
                        gap={16}
                    >
                        <img
                            src={logo} alt={'logo'}
                            style={{ width: '30px', }}
                        />
                        <ITGlobalSearch/>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            items={menuItems}
                            style={{ flex: 1, minWidth: 0 }}
                            selectedKeys={[ selectedPageKey() ]}
                        />
                        <Switch
                            checkedChildren={t('Light')}
                            unCheckedChildren={t('Dark')}
                            value={!!lightTheme}
                            onChange={(boolean) => {
                                dispatch(setTheme({ theme: boolean }))
                            }}
                        />
                        <Select
                            options={languages}
                            value={selectedLanguage}
                            onChange={(value) => {
                                setSelectedLanguage(value)
                                i18n.changeLanguage(value)
                                navigate(getChangeLangUrl(value))
                            }}
                        />
                        <ITAccountMenu/>
                    </Flex>
                </Header>
                <Content
                    style={{
                        padding: '24px',
                        justifyContent: 'center',
                        display: 'flex',
                        minHeight: '700px',
                        alignItems: 'start',
                    }}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </ConfigProvider>
    )
}

export default withErrorBoundary(ITLayout, {
    fallback: <ITErrorBoundary/>
})