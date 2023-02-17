import type IPlaylist from "../api/IPlaylist";

interface IPlaylistsData {
    mostListenedPlaylist: IPlaylist,
    topPlaylists: IPlaylist[],
}

export default IPlaylistsData