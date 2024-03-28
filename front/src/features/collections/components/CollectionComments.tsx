import {useTranslation} from "react-i18next"
import {useEffect, useState} from "react"
import {useSelector} from "react-redux"

import collectionsApi from "@/features/collections/api.ts"
import setAxiosError from "@/plugins/setAxiosError.ts"

import {
    Button,
    Flex,
    Input,
    Skeleton
} from "antd"
import {SendOutlined} from "@ant-design/icons"
import Comment from "@/features/collections/components/Comment.tsx"

import {RootState} from "@/store/store.ts"
import {initialInput} from "@/defaults/contants.ts"

export type commentType = {
    _id: string,
    userId: string,
    username: string,
    createdDate: Date,
    collectionId: string,
    comment: string,
}

let getCommentsInterval: ReturnType<typeof setTimeout> | undefined  = undefined

const CollectionComments = ({ collectionId }: { collectionId: string }) => {

    const { t } = useTranslation()
    const [isLoading, setIsLoading ] = useState(false)
    const [comments, setComments ] = useState<commentType[] | undefined>()

    const userId = useSelector<RootState>(state => state.initial.user._id)

    const [commentInput, setCommentInput] = useState(initialInput)
    const [commentInputLoading, setCommentInputLoading] = useState(false)

    const getComments = async (hasLoading: boolean) => {
        if (hasLoading) setIsLoading(true)
        try {
            const { data: { comments } } = await collectionsApi.getCommentsByCollectionId({ collectionId })
            setComments(comments)
        } catch (error) {
            setAxiosError(error)
        } finally {
            if (hasLoading) setIsLoading(false)
        }
    }
    const deleteComment = async (commentId: string) => {
        try {
            const { data: { comments } } = await collectionsApi.deleteComment({ collectionId, commentId })
            setComments(comments)
        } catch (error) {
            setAxiosError(error)
        }
    }
    const editComment = async (commentId: string, newComment: string) => {
        try {
            const { data: { comments } } = await collectionsApi.editComment({
                collectionId,
                comment: newComment,
                commentId: commentId
            })
            setComments(comments)
        } catch (error) {
            setAxiosError(error)
        }
    }
    const postComment = async () => {
        if (!commentInput.value) return
        setCommentInputLoading(true)
        try {
            const { data: { comments } } = await collectionsApi.postComment({
                comment: commentInput.value,
                collectionId
            })
            setComments(comments)
            setCommentInput(initialInput)
        } catch (error) {
            setAxiosError(error)
        } finally {
            setCommentInputLoading(false)
        }
    }

    const setGetCommentsInterval = () => {
        getCommentsInterval = setInterval(() => {
            getComments(false)
        }, 5000)
    }

    const clearGetCommentsInterval = () => {
        clearInterval(getCommentsInterval)
        getCommentsInterval = undefined
    }

    useEffect(() => {
        getComments(true)
        setGetCommentsInterval()
        return () => clearGetCommentsInterval()
    }, [])

    return (
        <>
            {userId &&
                <div
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && commentInput.value) {
                            postComment()
                        }
                    }}
                >
                    <Input
                        value={commentInput.value}
                        size={'large'}
                        disabled={commentInputLoading}
                        placeholder={t('Send comment')}
                        onChange={(event) => {
                            if (event.target.value.length > 150) {
                                return
                            }
                            setCommentInput({ value: event.target.value, status: undefined})
                        }}
                        suffix={
                            <Button
                                shape={'circle'}
                                type={'primary'}
                                size={'small'}
                                disabled={commentInput.value.length <= 0 || commentInputLoading}
                                onClick={postComment}
                            >
                                <SendOutlined/>
                            </Button>
                        }
                    />
                </div>
            }
            {!isLoading && comments && (
                <Flex
                    style={{ marginTop: '8px' }}
                    vertical={true}
                    gap={8}
                >
                    {comments.map(comment => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            editComment={editComment}
                            deleteComment={deleteComment}
                        />
                    ))}
                </Flex>
            )}
            {isLoading &&
                <Skeleton/>
            }
        </>
    )
}

export default CollectionComments