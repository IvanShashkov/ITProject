import {
    Button,
    Flex,
    Input,
    Typography,
} from "antd"
import ITContentBox from "@/components/ITContentBox"

import {initialInput} from "@/defaults/contants"

import { useState } from "react"
import {useTranslation} from "react-i18next"
import { useNavigateTo } from "@/hooks/useNavigateTo.ts"
import {useDispatch} from "react-redux"

import {authApi} from "@/features/auth/api.ts"
import {setUserCredentials} from "@/store/slice/initial.ts"
import setAxiosError from "@/plugins/setAxiosError.ts"

type propsType = {
    type: 'registration' | 'login'
}

type pageOption = {
    buttonTitle: string,
    buttonAction: (() => void) | undefined,
    linkTitle: string,
    linkUrl: string,
}

const AuthForms = ({ type }: propsType) => {
    const { t } = useTranslation()
    const navigateTo = useNavigateTo()
    const dispatch = useDispatch()

    const [username, setUsername] = useState( initialInput )
    const [password, setPassword] = useState( initialInput )
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const getLogin = async () => {
        setIsLoading(true)
        try {
            const { data: { jwt, user, likedCollection} } = await authApi.login({
                username: username.value,
                password: password.value,
            })
            dispatch(setUserCredentials({ jwt, user, likedCollection }))
            navigateTo('/')
        } catch (error) {
            setAxiosError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getRegistration = async () => {
        setIsLoading(true)
        try {
            await authApi.registration({
                username: username.value,
                password: password.value,
            })
            const { data: { jwt, user, likedCollection} } = await authApi.login({
                username: username.value,
                password: password.value,
            })
            dispatch(setUserCredentials({ jwt, user, likedCollection }))
            navigateTo('/')
        } catch (error) {
            setAxiosError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const hasErrorForm = () => {
        let check = false
        if (!username.value) {
            setUsername({...username, status: 'error'})
            check = true
        }
        if (!password.value) {
            setPassword({...password, status: 'error'})
            check = true
        }
        return check
    }

    const getOptions = () => {
        const currOptions: pageOption = {
            buttonTitle: '',
            buttonAction: undefined,
            linkTitle: '',
            linkUrl: '',
        }
        if (type === 'registration') {
            currOptions.buttonTitle = t('Registration')
            currOptions.linkTitle = t('Already have an account? Login')
            currOptions.linkUrl = '/login'
            currOptions.buttonAction = () => {
                if (hasErrorForm()) {
                    return
                }
                getRegistration()
            }
        }
        if (type === 'login') {
            currOptions.buttonTitle = t('Login')
            currOptions.linkTitle = t("Don't have an account? Register")
            currOptions.linkUrl = '/registration'
            currOptions.buttonAction = () => {
                if (hasErrorForm()) {
                    return
                }
                getLogin()
            }
        }
        return currOptions
    }

    const options = getOptions()

    return (
        <ITContentBox
            style={{
                maxWidth: '400px',
                width: '100%',
                justifyContent: 'center'
            }}
        >
            <Flex
                vertical
                gap={12}
                style={{ alignItems: 'center' }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        typeof options.buttonAction === 'function' && options.buttonAction()
                    }
                }}
            >
                <Typography.Title level={3}>
                    ITProject
                </Typography.Title>
                <Input
                    placeholder={t('Username')}
                    value={username.value}
                    status={username.status}
                    onChange={(event) => {
                        if (event.target.value.length > 30) {
                            return
                        }
                        setUsername({ ...username, value: event.target.value })
                    }}
                />
                <Input.Password
                    placeholder={t('Password')}
                    value={password.value}
                    status={password.status}
                    visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                    onChange={(event) => {
                        setPassword({ ...password, value: event.target.value })
                    }}
                />
                <Typography.Link onClick={() => navigateTo(String(options.linkUrl))}>
                    {options.linkTitle}
                </Typography.Link>
                <Button
                    disabled={isLoading}
                    onClick={options.buttonAction}
                >
                    {options.buttonTitle}
                </Button>
            </Flex>
        </ITContentBox>
    )
}

export default AuthForms