<script lang="ts">
    import {authStore} from "../../store/authStore";
    import type {IUserData} from '../../interfaces/app/IUserData'
    import {getUserData} from "../../store/userStore";
    import type {IStoreState} from "../../interfaces/app/IStoreState";

    let user: IStoreState<IUserData>

    getUserData($authStore.accessToken)
        .then((value: IStoreState<IUserData>) => {
            user = value
            console.log(user)
        })
        .catch(er => console.log(er))

</script>

<svelte:head>
    <title>User</title>
</svelte:head>

<div class="user">
    {#if user}
        <div>
            <h1><a href="{user.data.uri}">{user.data.display_name}</a></h1>
            <img src="{user.data.images[0].url}" height="250px" width="250px" style="border: 3px solid white"/>
            <div class="user-info">
                <h4>Country: {user.data.country}</h4>
                <h4>Product: {user.data.product}</h4>
            </div>
        </div>
        <div>
            <h1>Your top artists</h1>
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
            <h1>Your top tracks</h1>
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
        <h1>Could not get user data</h1>
    {/if}
</div>

<style lang="scss">
  .user {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    flex-wrap: wrap;
    height: 100vh;
    width: 100vw;

    h1 {
      a {
        color: white;
      }
    }
  }

  .user-info {
    display: flex;
    gap: 20px;
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