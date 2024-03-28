import {createCollectionFields} from "@/features/collections/types/collectionType.ts";

export const getInitialField = () :createCollectionFields[] => (
    [
        {
            title: 'Field string',
            type: 'string',
            status: undefined
        },
        {
            title: 'Field number',
            type: 'number',
            status: undefined
        },
        {
            title: 'Field date',
            type: 'date',
            status: undefined
        },
    ]
)