<script lang="ts">
    import {getFavoritesData} from "../../store/favoritesStore";
    import {authStore} from "../../store/authStore";
    import type {IStoreState} from "../../interfaces/app/IStoreState";
    import type IFavoritesData from "../../interfaces/app/IFavoritesData";
    import {Circle} from "svelte-loading-spinners";


    let favorites: IStoreState<IFavoritesData>

    getFavoritesData($authStore.accessToken)
        .then((value: IStoreState<IFavoritesData>) => {
            favorites = value
            console.log(favorites)
        })
        .catch(er => console.log(er))

</script>

<svelte:head>
    <title>Favorites</title>
</svelte:head>

<div class="favorites">
    {#if favorites}
        <div class="section">
            <h1>Last favorite track</h1>
            <img style="height: 250px; width: 250px; border: 3px solid white;"
                 src={favorites.data.topTrack.album.images[0].url}/>
            <h1>{favorites.data.topTrack.name}</h1>
            <div class="item">
                {#each favorites.data.topTrack.artists as artist}
                    <div>{artist.name}</div>
                {/each}
            </div>
        </div>
        <div class="section">
            <h1>Recently favorite</h1>
            <div class="list">
                {#each favorites.data.topTracks as track}
                    <div class="item">
                        <img style="height: 50px; width: 50px;" src={track.track.album.images[0].url}/>
                        <div>
                            <span>{track.track.name}</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 5px">
                                {#each track.track.artists as artist}
                                    <div>{artist.name}</div>
                                {/each}
                            </div>
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
  .favorites {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    flex-wrap: wrap;
    height: 90vh;
    width: 100vw;
    overflow-y: auto;
  }

  .section {
    width: 250px;
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