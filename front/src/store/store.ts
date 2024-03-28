import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "@/store/rootReducer.ts"

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        })
    },
})

export default store