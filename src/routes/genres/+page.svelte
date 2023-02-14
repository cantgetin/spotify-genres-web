<script lang="ts">
    import type IArtist from "../../interfaces/IArtist";

    interface IGenre {
        name: string
        color: string
    }

    let artistsIds: string[]
    let artistsFull: IArtist[] = []
    let topGenres: IGenre[] = [
        {name: 'Pop', color: "aqua"},
        {name: 'Rap', color: "green"},
        {name: 'Rock', color: "red"},
        {name: 'Jazz', color: "purple"},
        {name: 'Hip-Hop', color: "black"},
        {name: 'Electro', color: "grey"},
        {name: 'Dance', color: "brown"},
        {name: 'EDM', color: "orange"},
        {name: 'DnB', color: "slate"},
        {name: 'Classic', color: "pink"},
    ]


    // artistsIds = artists.map(a => a.id)
    // let artistsIdsString = artistsIds.join(',')
    //
    // axios.get(`https://api.spotify.com/v1/artists?ids=${artistsIdsString}`, {
    //     headers: {
    //         "Authorization": 'Bearer ' + $appAuthState.accessToken
    //     }
    // }).then((r: AxiosResponse<{ artists: IArtist[] }>) => {
    //     artistsFull = r.data.artists
    //     for (let i = 0; i < artistsFull.length; i++) {
    //         for (let j = 0; j < artistsFull[i].genres.length; j++) {
    //             topGenres.push(artistsFull[i].genres[j])
    //         }
    //     }
    //     loaded = true
    // });
</script>

<div class="genres">
    <div>
        <h1>Your best genre</h1>
        <div style="background: aqua; height: 250px; width: 250px; border: 3px solid white;"></div>
        <h1>Rap</h1>
    </div>
    <div>
        <h1>Your top genres</h1>
        <div class="list">
            {#each topGenres.slice(0, 10) as genre}
                <div class="item">
                    <div style="background: {genre.color}; height: 50px; width: 50px"></div>
                    <span>{genre.name}</span>
                    <div>15%</div>
                </div>
            {/each}
        </div>
    </div>
    <div>
        <h1>Number of tracks</h1>
        <div class="list">
            {#each topGenres.slice(0, 10) as genre}
                <div class="item">
                    <div style="background: {genre.color}; height: 50px; width: 50px"></div>
                    <span>{genre.name}</span>
                    <div>1,932 tracks</div>
                </div>
            {/each}
        </div>
    </div>
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