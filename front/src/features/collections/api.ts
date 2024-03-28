import api from "@/api/api.ts";
import {collectionFields, collectionItems} from "@/features/collections/types/collectionType.ts";

export type createCollectionProps = {
    fields: collectionFields[],
    items: collectionItems[],
    name: string,
    description: string,
}

export type editCollectionProps = {
    fields: collectionFields[],
    items: collectionItems[],
    name: string,
    description: string,
    collectionId: string,
}

const collectionsApi = {
    getCollections: () => {
        return api.get('api/getCollections', {})
    },
    createCollection: (payload: createCollectionProps) => {
        return api.post('api/createCollection', payload)
    },
    editCollection: (payload: editCollectionProps) => {
        return api.post('api/editCollection', payload)
    },
    getCollectionById: ({ collectionId }: {collectionId: string | undefined}) => {
        return api.post('api/getCollectionById', { collectionId })
    },
    getUserCollections: ({ userId }: { userId: string }) => {
        return api.post('api/getCollectionByUserId', ({ userId }))
    },
    deleteCollectionById: ({ collectionId }: {collectionId: string | undefined}) => {
        return api.post('api/deleteCollection', { collectionId })
    },
    postComment: ({ collectionId, comment }: { collectionId: string, comment: string }) => {
        return api.post('api/postComment',  { collectionId, comment })
    },
    editComment: ({ collectionId, comment, commentId }: { collectionId: string, comment: string, commentId: string }) => {
        return api.post('api/editComment',  { collectionId, comment, commentId })
    },
    deleteComment: ({ collectionId, commentId }: { collectionId: string, commentId: string }) => {
        return api.post('api/deleteComment',  { collectionId, commentId })
    },
    getCommentsByCollectionId: ({ collectionId }: { collectionId: string }) => {
        return api.post('api/getCommentsByCollectionId',  { collectionId })
    },
    getLikeCollectionById: ({ collectionId }: { collectionId: string }) => {
        return api.post('api/getLikeCollectionById',  { collectionId })
    },
    getUnlikeCollectionById: ({ collectionId }: { collectionId: string }) => {
        return api.post('api/getUnlikeCollectionById',  { collectionId })
    },
    getManyCollectionsByIds: ({ collectionIdsArr }: { collectionIdsArr: string[] }) => {
        return api.post('api/getManyCollectionsByIds', { collectionIdsArr })
    }
}

export default collectionsApi