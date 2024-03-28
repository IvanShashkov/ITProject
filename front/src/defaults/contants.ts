
export type inputType = {
    value: string,
    status: undefined | 'error',
}

export const initialInput: inputType = {
    value: '',
    status: undefined,
}

export const languages = [
    { label: 'English', value: 'en' },
    { label: 'Русский', value: 'ru' },
]
export const defaultLanguage = 'en'