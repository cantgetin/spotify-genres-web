import {storage} from "./store";
import type IAuth from "../interfaces/app/IAuth";
import {goto} from "$app/navigation";
import qs from "qs";
import axios from "axios";
import type {AxiosResponse} from 'axios'

// Create a storage
export const authStore = storage<IAuth>("auth", {state: '', authCode: '', accessToken: '', refreshToken: '',})

let auth: IAuth
export const authorize = () => {
    authStore.subscribe((value) => {
        auth = value;
    });
    const generateRandomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirect_uri = 'http://localhost:5173/authorize';
    const state = generateRandomHex(16);
    const scope = 'user-read-private user-read-email user-top-read playlist-read-private';

    auth.state = state
    authStore.set(auth)

    const href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;
    goto(href);
}
export const authorizeResponse = (code: string, state: string, error: string) => {
    authStore.subscribe((value) => {
        auth = value;
    });
    if (auth.state == state && !error) {
        auth.authCode = code
        authStore.set(auth)
        return true
    }
    return false
}
export const exchangeAuthCodeForAccessAndRefreshTokens = (code: string) => {
    authStore.subscribe((value) => {
        auth = value;
    });
    const authBase64EncodedString = btoa(import.meta.env.VITE_SPOTIFY_CLIENT_ID + ':' + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET)
    const data = {
        code: code,
        redirect_uri: 'http://localhost:5173/authorize',
        grant_type: 'authorization_code'
    };
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + authBase64EncodedString
        },
        data: qs.stringify(data),
        url: 'https://accounts.spotify.com/api/token'
    };
    axios(options).then((r: AxiosResponse<{ access_token: string, refresh_token: string }>) => {
        auth.accessToken = r.data.access_token
        auth.refreshToken = r.data.refresh_token
        authStore.set(auth)
        goto('/user')
    })
}
export const exchangeRefreshTokenForAccessToken = () => {
    authStore.subscribe((value) => {
        auth = value;
    });
    const authBase64EncodedString = btoa(import.meta.env.VITE_SPOTIFY_CLIENT_ID + ':' + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET)
    const data = {
        refresh_token: auth.refreshToken,
        grant_type: 'refresh_token'
    };
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + authBase64EncodedString
        },
        data: qs.stringify(data),
        url: 'https://accounts.spotify.com/api/token'
    };
    axios(options).then((r: AxiosResponse<{ access_token: string}>) => {
        auth.accessToken = r.data.access_token
        authStore.set(auth)
        goto('/user')
    })
}

