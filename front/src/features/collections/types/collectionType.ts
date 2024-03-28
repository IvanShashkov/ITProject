
export type createCollectionDataFields = {
    type: 'string' | 'date' | 'number',
    value: string | Date | number | undefined,
    status: 'error' | undefined
}

export type collectionDataFields = {
    type: 'string' | 'date' | 'number',
    value: string | Date | number | undefined,
}

export type createCollectionFields = {
    type: 'string' | 'date' | 'number',
    title: string,
    status: 'error' | undefined
}

export type collectionFields = {
    type: 'string' | 'date' | 'number',
    title: string
}

export type createCollectionItems = {
    id: number,
    fields: createCollectionDataFields[]
}

export type collectionItems = {
    id: number,
    fields: collectionDataFields[]
}

export type collectionType = {
    _id: string,
    name: string,
    description: string,
    userId: string,
    username: string,
    createdDate: Date,
    fields: collectionFields[],
    items: createCollectionItems[],
    likes: number,
}

export type collectionsList = {
    initial: undefined | collectionType[],
    filtered: undefined | collectionType[]
}
