import {createBrowserRouter} from "react-router-dom"
import ITLayout from "./components/ITLayout"

import Auth from "@/features/auth/routes"
import Admin from "@/features/admin/routes.tsx"
import Collections from "@/features/collections/routes.tsx"
import Main from "@/features/main/routes.tsx"

import ITNotFound from "@/components/ITNotFound.tsx"
import ITIInternalServerError from "@/components/ITInternalServerError.tsx"

const router = createBrowserRouter([
    {
        path: '/:lang?',
        element: <ITLayout/>,
        children: [
            ...Main,
            ...Auth,
            ...Admin,
            ...Collections,
        ],
    },
    {
        path: '500',
        element: <ITIInternalServerError/>,
    },
    {
        path: '*',
        element: <ITNotFound/>
    }
])

export default router