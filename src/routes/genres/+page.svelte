<script lang="ts">
    import {getGenresData} from "../../store/genresStore";
    import {authStore} from "../../store/authStore";
    import type {IStoreState} from "../../interfaces/app/IStoreState";
    import type IGenresData from "../../interfaces/app/IGenresData";
    import {Circle} from "svelte-loading-spinners";

    let genres: IStoreState<IGenresData>

    getGenresData($authStore.accessToken)
        .then((value: IStoreState<IGenresData>) => {
            genres = value
            console.log(genres)
        })
        .catch(er => console.log(er))

</script>

<svelte:head>
    <title>Genres</title>
</svelte:head>

<div class="genres">
    {#if genres}
        <div>
            <h1>Your best genre</h1>
            <div style="background: {genres.data.bestGenre.color}; height: 250px; width: 250px; border: 3px solid white;"></div>
            <h1>{genres.data.bestGenre.name}</h1>
        </div>
        <div>
            <h1>Your top genres</h1>
            <div class="list">
                {#each genres.data.topGenres as genre}
                    <div class="item">
                        <div style="background: {genre.color}; height: 50px; width: 50px"></div>
                        <span>{genre.name}</span>
                        <div>{genre.presencePercent}</div>
                    </div>
                {/each}
            </div>
        </div>
        <div>
            <h1>Number of artists</h1>
            <div class="list">
                {#each genres.data.topGenres as genre}
                    <div class="item">
                        <div style="background: {genre.color}; height: 50px; width: 50px"></div>
                        <span>{genre.name}</span>
                        <div>{genre.numberOfArtists} artists</div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <Circle size="60" color="white" unit="px" duration="1s" />
    {/if}
</div>

<style lang="scss">
  .genres {
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