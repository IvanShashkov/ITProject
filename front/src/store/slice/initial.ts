import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

import httpClient from "@/api/httpClient.ts"
import api from "@/api/api.ts";
import {NavigateFunction} from "react-router-dom"
export const jwtTokenLocalStorage = 'localStorageJwt'
export const headerJwtName = 'Authorization'

export const localStorageThemeKey = 'lightThemeLocal'
const setLocalStorageTheme = (boolean: boolean) => {
    localStorage.setItem(localStorageThemeKey, JSON.stringify(boolean))
}

export type userProps = {
    _id: string | undefined,
    username: string | undefined,
    registrationDate: Date | undefined,
    isBanned: boolean | undefined,
    role: string[] | undefined,
    lastLogin: Date | undefined,
    likes: string[] | undefined,
}

export type likeType = {
    userId: string,
    collectionId: string,
}

const initialState = {
    user: {
        _id: undefined,
        username: undefined,
        registrationDate: undefined,
        isBanned: undefined,
        role: undefined,
        lastLogin: undefined,
        likes: undefined,
    },
    likedCollection: [],
    isLoading: true,
    lightTheme: true,
}

interface initialStateInterface {
    user: userProps,
    likedCollection: likeType[],
    isLoading: boolean,
    lightTheme: boolean,
}

export const userInit = createAsyncThunk('initial/csrfInit', async function ({ navigate }: { navigate: NavigateFunction }) {
    try {
        const jwtToken = localStorage.getItem(jwtTokenLocalStorage)
        if (jwtToken) {
            httpClient.defaults.headers[headerJwtName] = jwtToken
            const { data } = await api.get('/jwtInit', {})
            return data
        }
        return { user: null }
    } catch (error) {
        navigate('/500')
    }
})

const initialSlice = createSlice({
    name: 'initial',
    initialState: initialState as initialStateInterface,
    reducers: {
        setUserCredentials: (state, { payload: { jwt, user, likedCollection} }) => {
            state.user = user
            state.likedCollection = likedCollection
            localStorage.setItem(jwtTokenLocalStorage, jwt)
            httpClient.defaults.headers[headerJwtName] = jwt
        },
        setLikedCollection: (state, { payload: { likedCollection } }) => {
            state.likedCollection = likedCollection
        },
        setTheme: (state, {  payload: { theme } }) => {
            state.lightTheme = theme
            setLocalStorageTheme(theme)
        },
        logout: (state) => {
            state.user = initialState.user
            state.likedCollection = []
            localStorage.setItem(jwtTokenLocalStorage, '')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(userInit.pending, (state) => {
                state.isLoading = true
            })
            .addCase(userInit.fulfilled, (state, { payload }) => {
                if (!payload.user) {
                    state.isLoading = false
                    return
                }

                state.likedCollection = payload.likedCollection
                state.user = payload.user
                state.isLoading = false
            })
            .addCase(userInit.rejected, (state) => {
                state.isLoading = false
            })
    }
})

export const {
    setUserCredentials,
    setLikedCollection,
    logout,
    setTheme,
} = initialSlice.actions

export default initialSlice.reducer
