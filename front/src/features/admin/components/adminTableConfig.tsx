import {Typography} from "antd"

import dayjs from "dayjs";

import {userProps} from "@/store/slice/initial.ts"
import {TFunction} from "i18next"

import {hasRole} from "@/plugins/hasRole.ts";

const adminTableConfig = ({ t }: { t: TFunction }) => ([
    {
        title: <Typography>ID</Typography>,
        render: (_: undefined, row: userProps) => <Typography>{row._id}</Typography>,
    },
    {
        title: <Typography>{t('Username')}</Typography>,
        render: (_: undefined, row: userProps) => <Typography>{row.username}</Typography>,
    },
    {
        title: <Typography>{t('Register data')}</Typography>,
        render: (_: undefined, row: userProps) => <Typography>{dayjs(row.registrationDate).format('HH:mm DD.MM.YYYY')}</Typography>,
    },
    {
        title: <Typography>{t('Last login')}</Typography>,
        render: (_: undefined, row: userProps) => <Typography>{dayjs(row.lastLogin).format('HH:mm DD.MM.YYYY')}</Typography>,
    },
    {
        title: <Typography>{t('Status')}</Typography>,
        render: (_: undefined, row: userProps) => <Typography>{row.isBanned ? t('Banned') : t('Active')}</Typography>,
    },
    {
        title: <Typography>{t('Role')}</Typography>,
        render: (_: undefined, row: userProps) => <Typography>{hasRole(row.role, 'admin') ? t('Admin') : t('User')}</Typography>,
    },
])

export default adminTableConfig