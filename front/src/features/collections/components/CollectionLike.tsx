import {useSelector} from "react-redux"
import {useState} from "react"

import {RootState} from "@/store/store.ts"
import {collectionType} from "@/features/collections/types/collectionType.ts"

import {Button} from "antd"
import {LikeOutlined} from "@ant-design/icons"
import {hasLike} from "@/features/collections/utils/hasLike.ts"

type collectionLikeProps = {
    collection: collectionType,
    getLike: (arg0: string) => void,
    getUnlike: (arg0: string) => void,
}

const CollectionLike = ({ collection, getLike, getUnlike }: collectionLikeProps) => {
    const userId = useSelector<RootState>(state => state.initial.user._id)
    const likedCollection = useSelector<RootState>(state => state.initial.likedCollection)

    const hasCollectionLike = hasLike(likedCollection, collection)
    const [isLoading, setIsLoading] = useState(false)

    const likeAction = async () => {
        setIsLoading(true)
        if (hasCollectionLike) {
            await getUnlike(collection._id)
        }
        if (!hasCollectionLike) {
            await getLike(collection._id)
        }
        setIsLoading(false)
    }

    return (
        <>
            {userId &&
                <Button
                    shape={'circle'}
                    disabled={isLoading}
                    type={hasCollectionLike ? 'primary' : 'default'}
                    onClick={likeAction}
                >
                    <LikeOutlined />
                </Button>
            }
        </>
    )
}

export default CollectionLike