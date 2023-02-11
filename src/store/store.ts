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
        getUserToken: () => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            return currentAppState.userToken
        },
        setAppState: (value: string) => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            currentAppState.state = value
            window.localStorage.setItem(AUTH_NAME, JSON.stringify(currentAppState))
        },
        setUserToken: (value: string) => {
            const currentAppState : IAuth = JSON.parse(window.localStorage.getItem(AUTH_NAME) || '{}')
            currentAppState.userToken = value
            window.localStorage.setItem(AUTH_NAME, JSON.stringify(currentAppState))
        },
    }
}

export const appAuthState = createAuthStore()
