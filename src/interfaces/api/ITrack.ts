import type IAlbum from "./IAlbum";
import type IArtist from "./IArtist";

interface ITrack {
    name: string
    artists: Omit<IArtist, "genres">[],
    album: IAlbum
}

export default ITrack