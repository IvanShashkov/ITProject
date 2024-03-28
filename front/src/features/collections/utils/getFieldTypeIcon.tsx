import {FieldNumberOutlined, FieldStringOutlined, FieldTimeOutlined} from "@ant-design/icons";

export const getFieldTypeIcon = (type: 'string' | 'date' | 'number') => {
    if (type === 'string') {
        return <FieldStringOutlined />
    }
    if (type === 'number') {
        return <FieldNumberOutlined />
    }
    if (type === 'date') {
        return <FieldTimeOutlined />
    }
}