import type IUser from "./IUser";
import type ITrack from "./ITrack";
import type IArtist from "./IArtist";

export interface IUserData extends IUser {
    topTracks: ITrack[];
    topArtists: Omit<IArtist, "genres">[]
}

export default IUserData
