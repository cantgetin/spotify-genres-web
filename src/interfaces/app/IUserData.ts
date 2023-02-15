import type IUser from "../api/IUser";
import type ITrack from "../api/ITrack";
import type IArtist from "../api/IArtist";

export interface IUserData extends IUser {
    topTracks: ITrack[];
    topArtists: Omit<IArtist, "genres">[]
}

export default IUserData
