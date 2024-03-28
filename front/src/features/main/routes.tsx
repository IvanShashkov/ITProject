import MainPage from "@/features/main/pages/MainPage.tsx"

const routes = [
    {
        index: true,
        element: <MainPage/>,
        handle: {
            crumb: () => ({ title: 'Main', key: '/' }),
        },
    },
]

export default routes