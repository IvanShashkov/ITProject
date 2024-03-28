import Admin from "@/features/admin/pages/Admin.tsx"


const routes = [
    {
        path: 'admin',
        element: <Admin/>,
        handle: {
            crumb: () => ({ title: 'Admin', key: 'admin' }),
        },
    },
]

export default routes
