// need to store here:
// client token
// state
// use localstorage

import { writable } from 'svelte/store';
import {AUTH_NAME} from "../constants";
import type IAuth from "../interfaces/IAuth";

const createAuthStore = () => {
    const {subscribe, set} = writable<IAuth>(JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}'))

    return {
        subscribe,
        set: (value: IAuth) => {
            window.localStorage.setItem(AUTH_NAME, JSON.stringify(value))
            set(value)
        },
        getAppState: () => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            return currentAppState.state
        },
        getAuthCode: () => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            return currentAppState.authCode
        },
        getAccessToken: () => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            return currentAppState.accessToken
        },
        getRefreshToken: () => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            return currentAppState.refreshToken
        },
        setAppState: (value: string) => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            currentAppState.state = value
            window.localStorage.setItem(AUTH_NAME, JSON.stringify(currentAppState))
        },
        setAuthCode: (value: string) => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            currentAppState.authCode = value
            window.localStorage.setItem(AUTH_NAME, JSON.stringify(currentAppState))
        },
        setAccessToken: (value: string) => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            currentAppState.accessToken = value
            window.localStorage.setItem(AUTH_NAME, JSON.stringify(currentAppState))
        },
        setRefreshToken: (value: string) => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            currentAppState.refreshToken = value
            window.localStorage.setItem(AUTH_NAME, JSON.stringify(currentAppState))
        },
    }
}

export const appAuthState = createAuthStore()
