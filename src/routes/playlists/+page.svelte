<script lang="ts">
    import type {IStoreState} from "../../interfaces/app/IStoreState";
    import type IPlaylistsData from "../../interfaces/app/IPlaylistsData";
    import {getPlaylistsData} from "../../store/playlistsStore";
    import {authStore} from "../../store/authStore";
    import {Circle} from "svelte-loading-spinners";

    let playlists: IStoreState<IPlaylistsData>

    getPlaylistsData($authStore.accessToken)
        .then((value: IStoreState<IPlaylistsData>) => {
            playlists = value
            console.log(playlists)
        }).catch(er => console.log(er))

</script>

<svelte:head>
    <title>Playlists</title>
</svelte:head>

<div class="playlists">
    {#if playlists}
        <div style="max-width: 260px">
            <h1>Your best playlist</h1>
            <img src={playlists.data.mostListenedPlaylist.images[0].url} height="250px" width="250px"
                 style="border: 3px solid white; background: aqua"/>
            <div class="user-info">
                <h1>{playlists.data.mostListenedPlaylist.name}</h1>
                <div class="item">
                    <div>{playlists.data.mostListenedPlaylist.tracks.total} tracks,</div>
                    <div>{playlists.data.mostListenedPlaylist.popularity} loved tracks</div>
                </div>
            </div>
        </div>
        <div>
            <h1>Most listened playlists</h1>
            <div class="list">
                {#each playlists.data.topPlaylists.sort((a, b) => b.popularity - a.popularity).slice(0, 10) as playlist}
                    <div class="item">
                        <img src={playlist.images[0].url} height="50px" width="50px"/>
                        <div>
                            <span>{playlist.name}</span>
                            <div>{playlist.popularity > 0 ? `${playlist.popularity} loved tracks` : ''}</div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div>
            <h1>Number of tracks</h1>
            <div class="list">
                {#each playlists.data.topPlaylists.sort((a, b) => b.tracks.total - a.tracks.total).slice(0, 10) as playlist}
                    <div class="item">
                        <img src={playlist.images[0].url} height="50px" width="50px"/>
                        <div>
                            <span>{playlist.name}</span>
                            <div>{playlist.tracks.total} tracks</div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <Circle size="60" color="white" unit="px" duration="1s" />
    {/if}
</div>

<style lang="scss">
  .playlists {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    flex-wrap: wrap;
    height: 100vh;
    width: 100vw;
    overflow-y: auto;
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