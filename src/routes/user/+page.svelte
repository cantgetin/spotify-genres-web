<script lang="ts">
    import {appAuthState} from "../../store/store";
    import axios from "axios";
    import type {AxiosResponse} from 'axios';
    import type IUser from "../../interfaces/IUser";
    import type IArtist from "../../interfaces/IArtist";
    import type ITrack from "../../interfaces/ITrack";

    let user: IUser
    let artists: Omit<IArtist, "genres">[] = []
    let tracks: ITrack[] = []
    let artistsIds: string[]
    let artistsFull: IArtist[] = []
    let topGenres: string[] = []
    let loaded = false

    axios.get('https://api.spotify.com/v1/me', {
        headers: {
            "Authorization": 'Bearer ' + $appAuthState.accessToken
        }
    }).then((r: AxiosResponse<IUser>) => user = r.data);


    axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
        headers: {
            "Authorization": 'Bearer ' + $appAuthState.accessToken
        }
    }).then((r: AxiosResponse<{ items: ITrack[] }>) => tracks = r.data.items);

    axios.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
        headers: {
            "Authorization": 'Bearer ' + $appAuthState.accessToken
        }
    }).then((r: AxiosResponse<{ items: IArtist[] }>) => {
        artists = r.data.items
        artistsIds = artists.map(a => a.id)
        let artistsIdsString = artistsIds.join(',')

        axios.get(`https://api.spotify.com/v1/artists?ids=${artistsIdsString}`, {
            headers: {
                "Authorization": 'Bearer ' + $appAuthState.accessToken
            }
        }).then((r: AxiosResponse<{ artists: IArtist[] }>) => {
            artistsFull = r.data.artists
            for(let i = 0; i<artistsFull.length; i++){
                for(let j =0; j<artistsFull[i].genres.length; j++){
                    topGenres.push(artistsFull[i].genres[j])
                }
            }
            loaded = true
        });
    });

</script>

<div class="user">
    {#if loaded}
        <div>
            <h1>Welcome, {user.display_name}!</h1>
            <img src="{user.images[0].url}"/>
        </div>
        <div>
            <h1>Your top artists:</h1>
            <div class="list">
                {#each artists as artist}
                    <div class="item">
                        <img src="{artist.images[0].url}" height="50px" width="50px"/>
                        <span>{artist.name}</span>
                    </div>
                {/each}
            </div>
        </div>
        <div>
            <h1>Your top tracks:</h1>
            <div class="list">
                {#each tracks as track}
                    <div class="item">
                        <img src="{track.album.images[0].url}" height="50px" width="50px"/>
                        <div>
                            <span>{track.name}</span>
                            <div class="item">
                                {#each track.artists as artist}
                                    <div>{artist.name}</div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div>
            <h1>Your top genres:</h1>
            <div class="list">
                {#each topGenres.slice(0,10) as genre}
                    <div class="item">
                        <div style="background: green; height: 50px; width: 50px"></div>
                        <span>{genre}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
  .user {
    padding: 50px;
    display: flex;
    gap: 50px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .item {
    display: flex;
    color: #7f7f7f;
    gap: 5px;

    span {
      color: white;
    }
  }
</style>