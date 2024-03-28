import {createCollectionDataFields} from "@/features/collections/types/collectionType.ts"
import {Typography} from "antd"
import dayjs from "dayjs"
import {useTranslation} from "react-i18next"

const ItemDataField = ({ dataField }: { dataField: createCollectionDataFields }) => {
    const { t} = useTranslation()

    if (dataField.type === 'date' && dataField.value instanceof Date) {
        return <Typography>{dayjs(dataField.value).format('DD.MM.YYYY')}</Typography>
    }
    if (dataField.type === 'string' && typeof dataField.value === 'string') {
        return <Typography>{t(dataField.value)}</Typography>
    }
    if (dataField.type === 'number' && typeof dataField.value === 'number') {
        return <Typography>{dataField.value}</Typography>
    }
}
export default ItemDataField