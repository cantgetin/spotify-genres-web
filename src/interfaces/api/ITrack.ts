import type IAlbum from "./IAlbum";
import type IArtist from "./IArtist";

interface ITrack {
    id: string
    name: string
    artists: Omit<IArtist, "genres">[],
    album: IAlbum
}

export default ITrack