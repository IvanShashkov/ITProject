import {enqueueSnackbar} from "notistack"
import { t } from "i18next"

const setAxiosError = (error: any) => {

    if (!error?.response?.data.message) {
        return enqueueSnackbar(`${t(error.message)}`, {
            variant: 'error',
        })
    }

    enqueueSnackbar(`${error.response.data.message}`, {
        variant: 'error',
    })
}

export default setAxiosError