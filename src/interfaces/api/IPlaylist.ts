interface IPlaylist {
    id: string
    name: string
    images: [],
    uri: string,
    popularity: number,

    tracks: { total: number, href: string }
}

export default IPlaylist