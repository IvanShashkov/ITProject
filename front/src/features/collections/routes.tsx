import CollectionsList from "@/features/collections/pages/CollectionsList.tsx"
import NewCollection from "@/features/collections/pages/NewCollection.tsx"
import CollectionView from "@/features/collections/pages/CollectionView.tsx"
import UserCollectionsList from "@/features/collections/pages/UserCollectionsList.tsx";
import MyCollections from "@/features/collections/pages/MyCollections.tsx";
import LikedCollections from "@/features/collections/pages/LikedCollections.tsx";

const routes = [
    {
        path: 'collections',
        element: <CollectionsList/>,
        handle: {
            crumb: () => ({ title: 'Collections', key: 'collections' }),
        },
    },
    {
        path: 'newCollection',
        element: <NewCollection type={'create'}/>,
        handle: {
            crumb: () => ({ title: 'New collection', key: 'newCollection' }),
        }
    },
    {
        path: 'editCollection/:collectionId',
        element: <NewCollection type={'edit'}/>,
        handle: {
            crumb: () => ({ title: 'Edit collection', key: 'editCollection' }),
        }

    },
    {
        path: 'collection/:collectionId',
        element: <CollectionView/>,
        handle: {
            crumb: () => ({ title: 'Collection View', key: 'collectionView' }),
        }
    },
    {
        path: 'userCollection/:userId',
        element: <UserCollectionsList/>,
        handle: {
            crumb: () => ({ title: 'User collection', key: 'userCollection' }),
        }
    },
    {
        path: 'myCollections',
        element: <MyCollections/>,
        handle: {
            crumb: () => ({ title: 'My collections', key: 'myCollections' }),
        }
    },
    {
        path: 'likedCollections',
        element: <LikedCollections/>,
        handle: {
            crumb: () => ({ title: 'Liked collections', key: 'likedCollections' }),
        }
    },
]

export default routes
