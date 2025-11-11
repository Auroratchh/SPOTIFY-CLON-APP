export interface SpotifyTrackResponse {
    id: string,
    name: string,
    duration_ms: number,
    href: string
    artists:[
        {
            id: string,
            name: string,
            href:string
        }
    ]
}
