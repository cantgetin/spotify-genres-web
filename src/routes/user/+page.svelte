<script lang="ts">
    import {appAuthState} from "../../store/store";
    import type {IUserData} from '../../interfaces/IUserData'
    import {getUserData} from "../../store/userStore";
    import type {IStoreState} from "../../interfaces/IStoreState";

    let user: IStoreState<IUserData>

    getUserData($appAuthState.accessToken)
        .then((value: IStoreState<IUserData>) => {
            user = value
            console.log(value)
        })
        .catch(er => console.log(er))

</script>

<div class="user">
    {#if user}
        <div>
            <h1>Welcome, {user.data.display_name}!</h1>
            <img src="{user.data.images[0].url}"/>
        </div>
        <div>
            <h1>Your top artists:</h1>
            <div class="list">
                {#each user.data.topArtists as artist}
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
                {#each user.data.topTracks as track}
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
    {:else}
        <h1>lol</h1>
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