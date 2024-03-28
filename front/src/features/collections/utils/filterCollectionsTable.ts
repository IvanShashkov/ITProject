import {collectionType} from "@/features/collections/types/collectionType.ts";

type filterCollectionsTableProps = {
    collections: collectionType[] | undefined,
    filterSearch: string,
}

export const filterCollectionsTable = ({ collections, filterSearch }: filterCollectionsTableProps): collectionType[]  => {
    if (!collections) {
        return []
    }

    return collections.filter(collection => collection.name.toLowerCase().includes(filterSearch.toLowerCase()))
}