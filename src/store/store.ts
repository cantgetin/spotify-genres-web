import type { Writable } from 'svelte/store';
import { writable, get } from 'svelte/store'
import type IAuth from "../interfaces/IAuth";

export const storage = <T>(key: string, initValue: T): Writable<T> => {
    const store = writable(initValue);

    const storedValueStr = localStorage.getItem(key);
    if (storedValueStr != null) store.set(JSON.parse(storedValueStr));

    store.subscribe((val) => {
        if (val == undefined) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, JSON.stringify(val))
        }
    })

    window.addEventListener('storage', () => {
        const storedValueStr = localStorage.getItem(key);
        if (storedValueStr == null) return;

        const localValue: T = JSON.parse(storedValueStr)
        if (localValue !== get(store)) store.set(localValue);
    });

    return store;
}

export const appAuthState = storage<IAuth>("auth", {state : '', authCode: '', accessToken: '', refreshToken: '',})