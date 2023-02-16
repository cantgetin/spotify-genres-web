<script lang="ts">
    const playlists = [
        {name: 'Playlist1', color: 'blue'},
        {name: 'Playlist1', color: 'red'},
        {name: 'Playlist1', color: 'aqua'},
        {name: 'Playlist1', color: 'green'},
        {name: 'Playlist1', color: 'pink'},
        {name: 'Playlist1', color: 'blue'},
        {name: 'Playlist1', color: 'blue'},
        {name: 'Playlist1', color: 'blue'},
        {name: 'Playlist1', color: 'blue'},
        {name: 'Playlist1', color: 'blue'},
    ]

</script>

<div class="playlists">
    <div>
        <h1>Best playlist</h1>
        <img height="250px" width="250px" style="border: 3px solid white; background: aqua"/>
        <div class="user-info">
            <h4>1,932 tracks</h4>
            <h4>1233 hours listened</h4>
        </div>
    </div>
    <div>
        <h1>Most listened playlists</h1>
        <div class="list">
            {#each playlists as playlist}
                <div class="item">
                    <div style="height: 50px; width: 50px; background: {playlist.color}"></div>
                    <span>{playlist.name}</span>
                </div>
            {/each}
        </div>
    </div>
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