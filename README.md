# Spotify Genres Web

An app that displays Spotify user statistics, preferred genres, playlists, tracks.\
Interacts with the Spotify API using the OAuth2 access token obtained after user authorization.\
Not much interactive, only displays received data.

## Tech
Svelte\
Typescript\
scss

## Run

#### Create .env and set this variables
VITE_SPOTIFY_CLIENT_ID\
VITE_SPOTIFY_CLIENT_SECRET\
VITE_REDIRECT_URI

Register and get your client id/secret [here](https://developer.spotify.com/)

```bash
# install dependencies
npm install

# start app on dev server
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```


