import {
    collectionDataFields,
    collectionFields, createCollectionItems,
    createCollectionDataFields, createCollectionFields
} from "@/features/collections/types/collectionType.ts";

export const getTitlePage = (type: 'edit' | 'create') => {
    if (type === 'edit' ) return 'Edit collection'
    if (type === 'create' ) return 'Create collection'
}

export const prepareItemDataFieldsToReq = (itemDataFields: createCollectionDataFields[] | collectionDataFields[]) : collectionDataFields[] => {
    return itemDataFields.map((field) => ({
        type: field.type,
        value: field.value
    }))
}

export const prepareCollectionFieldsToReq = (collectionFields: createCollectionFields[]): collectionFields[] => {
    return collectionFields.map(field => ({
        type: field.type,
        title: field.title
    }))
}

export const prepareItemDataFieldsToFront = (itemDataFields: collectionDataFields[]): createCollectionDataFields[] => {
    return itemDataFields.map((field) => ({
        type: field.type,
        value: field.value,
        status: undefined
    }))
}

export const prepareCollectionFieldsToFront = (collectionFields: collectionFields[]): createCollectionFields[] => {
    return collectionFields.map((field) => ({
        type: field.type,
        title: field.title,
        status: undefined
    }))
}

export const getInitialNewItem = (fields: createCollectionFields[], itemId: number): createCollectionItems => {
    return {
        id: itemId,
        fields: fields.map(field => {
            if (field.type === 'date') {
                return  { type: field.type, value: undefined, status: undefined }
            }
            return { type: field.type, value: '', status: undefined }
        })
    }
}