import {enqueueSnackbar} from "notistack"

const setAxiosError = (error: any) => {

    if (!error?.response?.data.message) {
        return enqueueSnackbar(`${error.message}`, {
            variant: 'error',
        })
    }

    enqueueSnackbar(`${error.response.data.message}`, {
        variant: 'error',
    })
}

export default setAxiosError