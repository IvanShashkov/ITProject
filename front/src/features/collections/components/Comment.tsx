import {
    Button,
    Flex,
    Input,
    Popover,
    Typography
} from "antd"
import {
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
    SendOutlined
} from "@ant-design/icons"
import {initialInput} from "@/defaults/contants.ts"
import ITGrayBox from "@/components/ITGrayBox.tsx"

import {useState} from "react"
import {useSelector} from "react-redux"
import {useTranslation} from "react-i18next"
import {useNavigateTo} from "@/hooks/useNavigateTo.ts"

import {commentType} from "@/features/collections/components/CollectionComments.tsx"
import {RootState} from "@/store/store.ts"
import {hasRole} from "@/plugins/hasRole.ts"

import dayjs from "dayjs"

type CommentProps = {
    comment: commentType,
    editComment: (arg0: string, arg1: string) => void,
    deleteComment: (arg0: string) => void,
}

const Comment = ({ comment, editComment, deleteComment }: CommentProps) => {
    const { t } = useTranslation()
    const navigateTo =  useNavigateTo()
    const inputValueMax = 150

    const userId = useSelector<RootState>(state => state.initial.user._id)
    const userRoles = useSelector<RootState>(state => state.initial.user.role)

    const [actionPopoverOpen, setActionPopoverOpen] = useState(false)
    const [isLoading , setIsLoading] = useState(false)
    const [editLoading , setEditLoading] = useState(false)
    const [editInput, setEditInput] = useState(initialInput)
    const [onEdit, setOnEdit] = useState(false)

    const commentActionContent = (
        <Flex vertical={true} gap={4}>
            <Button
                disabled={isLoading}
                icon={ <EditOutlined /> }
                onClick={() => {
                    setEditInput({ ...editInput, value: comment.comment})
                    setOnEdit(true)
                    setActionPopoverOpen(false)
                }}
            >
                {t('Edit')}
            </Button>
            <Button
                danger={true}
                disabled={isLoading}
                icon={ <DeleteOutlined /> }
                onClick={async () => {
                    setIsLoading(true)
                    await deleteComment(comment._id)
                    setIsLoading(false)
                    setActionPopoverOpen(false)
                }}
            >
                {t('Delete')}
            </Button>
        </Flex>
    )

    const onOpenHandle = (newOpen: boolean) => setActionPopoverOpen(newOpen)

    const editUserComment = async () => {
        setEditLoading(true)
        await editComment(comment._id, editInput.value)
        setEditLoading(false)
        setOnEdit(false)
    }

    return (
        <ITGrayBox
            style={{ width: '100%' }}
        >
            {!onEdit &&
                <Flex
                    vertical={true}
                    style={{ alignItems: 'start' }}
                >
                    <Typography.Link
                        onClick={() => navigateTo(`/userCollection/${comment.userId}`)}
                    >
                        {comment.username}
                    </Typography.Link>
                    <Flex style={{ alignItems: 'center', width: '100%' }} >
                        <Typography
                            style={{ flexGrow: 1, }}
                        >
                            {comment.comment}
                        </Typography>
                        {(comment.userId === userId || hasRole(userRoles, 'admin')) && (
                            <Popover
                                content={commentActionContent}
                                open={actionPopoverOpen}
                                trigger={'click'}
                                onOpenChange={onOpenHandle}
                            >
                                <Button
                                    shape="circle"
                                >
                                    <MoreOutlined />
                                </Button>
                            </Popover>
                        )}
                    </Flex>
                    <Typography.Text
                        style={{ color: '#FFFFF' }}
                        type={'secondary'}
                    >
                        {dayjs(comment.createdDate).format('DD.MM.YYYY')}
                    </Typography.Text>
                </Flex>
            }
            {onEdit &&
                <div
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && editInput.value) {
                            editUserComment()
                        }
                    }}
                >
                    <Input
                        value={editInput.value}
                        style={{ height: '70px' }}
                        disabled={editLoading}
                        onChange={(event) => {
                            if (event.target.value.length > inputValueMax) {
                                return
                            }
                            setEditInput({ value: event.target.value, status: undefined })
                        }}
                        suffix={
                            <Button
                                shape={'circle'}
                                type={'primary'}
                                size={'small'}
                                disabled={editInput.value.length <= 0 || editLoading}
                                onClick={editUserComment}
                            >
                                <SendOutlined/>
                            </Button>
                        }
                    />
                </div>
            }
        </ITGrayBox>
    )
}

export default Comment