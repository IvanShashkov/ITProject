import {likeType} from "@/store/slice/initial.ts"
import {collectionType} from "@/features/collections/types/collectionType.ts"

export const hasLike = (likedCollection: unknown | likeType[], collection: collectionType | undefined) => {
    if (!Array.isArray(likedCollection) || !collection) {
        return false
    }
    return likedCollection.some(item => item.collectionId === collection._id)
}