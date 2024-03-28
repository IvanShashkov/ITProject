import {useNavigate, useParams} from "react-router-dom"
import {defaultLanguage} from "@/defaults/contants.ts"

export const useNavigateTo = () => {
    const navigate = useNavigate()
    const params = useParams()
    const initialLanguage = params?.lang ? params?.lang : defaultLanguage

    return (url: string) => navigate(`/${initialLanguage + url}`)
}
