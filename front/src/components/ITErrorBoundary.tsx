import ITContentBoxWithoutTheme from "@/components/ITContentBoxWithoutTheme.tsx"
import {Button, Flex, Typography} from "antd"

import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import {useErrorBoundary} from "react-error-boundary"

// @ts-ignore
import errorBoundary from "@/assets/errorBoundary.svg"

const ITNotFoundPage = () => {
    const navigate = useNavigate()
    const { resetBoundary } = useErrorBoundary()

    const { t, i18n } = useTranslation()

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
                        src={errorBoundary}
                    />
                    <Typography.Title
                        level={3}
                    >
                        {t('The cat broke the site sorry')}
                    </Typography.Title>
                    <Button
                        type={'primary'}
                        onClick={() => {
                            resetBoundary()
                            navigate(`/${i18n.language}`)
                        }}
                    >
                        {t('Back to Main')}
                    </Button>
                </Flex>
            </ITContentBoxWithoutTheme>
        </div>
    )
}

export default ITNotFoundPage