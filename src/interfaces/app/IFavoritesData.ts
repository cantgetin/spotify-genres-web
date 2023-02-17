import type ITrack from "../api/ITrack";

interface IFavoritesData {
    topTrack: ITrack,
    topTracks: { track: ITrack }[]
}

export default IFavoritesData