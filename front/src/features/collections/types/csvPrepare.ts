import { collectionFields, collectionItems } from "@/features/collections/types/collectionType.ts";

export const csvPrepareHeader = (headerFields: collectionFields[]) => {
    return headerFields.map(field => ({ id: field.title, displayName: field.title }))
}

export const csvPrepareData = (headerFields: collectionFields[], items: collectionItems[] ) => {
    const resData = []
    for (let i = 0; i < items.length; i++) {
        const prepareItem = {}
        for (let j = 0; j < headerFields.length; j++) {
            // @ts-ignore
            prepareItem[headerFields[j].title] = items[i].fields[j].value
        }
        resData.push(prepareItem)
    }
    return resData
}