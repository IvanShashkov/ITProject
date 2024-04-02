import {enqueueSnackbar} from "notistack"
import { t } from "i18next"

const setAxiosError = (error: any) => {

    if (!error?.response?.data.message) {
        return enqueueSnackbar(`${error.message}`, {
            variant: 'error',
        })
    }

    enqueueSnackbar(`${t(error.response.data.message)}`, {
        variant: 'error',
    })
}

export default setAxiosError