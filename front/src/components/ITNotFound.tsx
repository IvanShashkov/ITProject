import ITContentBoxWithoutTheme from "@/components/ITContentBoxWithoutTheme.tsx"
import {Button, Flex, Typography} from "antd"

import {useTranslation} from "react-i18next"
import {useLocation} from "react-router-dom"
import {useEffect} from "react"
import {useNavigate} from "react-router-dom"

// @ts-ignore
import page404 from "@/assets/page_404.svg"

import {languages} from "@/defaults/contants.ts"

const ITNotFound = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t, i18n } = useTranslation()

    const setLanguage = () => {
        languages.forEach(item => {
            if (location.pathname.includes(item.value)) {
                i18n.changeLanguage(item.value)
            }
        })
    }

    useEffect(() => {
        setLanguage()
    }, [])

    return (
        <div style={{ padding: '24px' }}>
            <ITContentBoxWithoutTheme>
                <Flex
                    style={{ alignItems: 'center' }}
                    gap={8}
                    vertical={true}
                >
                    <img
                        alt={'404'}
                        src={page404}
                    />
                    <Typography.Title
                        level={3}
                    >
                        {t("Page not found (it's cat)")}
                    </Typography.Title>
                    <Button
                        type={'primary'}
                        onClick={() => navigate(`/${i18n.language}`)}
                    >
                        {t('Back to Main')}
                    </Button>
                </Flex>
            </ITContentBoxWithoutTheme>
        </div>
    )
}

export default ITNotFound