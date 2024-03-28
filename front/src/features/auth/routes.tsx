import AuthForms from "@/features/auth/pages/AuthForms"

const routes = [
    {
        path: 'registration',
        element: <AuthForms type={'registration'}/>,
        handle: {
            crumb: () => ({ title: 'Registration', key: 'registration' }),
        },
    },
    {
        path: 'login',
        element: <AuthForms type={'login'}/>,
        handle: {
            crumb: () => ({ title: 'Login', key: 'login' }),
        },
    },
]

export default routes
