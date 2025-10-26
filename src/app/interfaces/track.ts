export interface Track {
    id: string,
    name: string,
    duration_ms: number,
    href: string,
    preview_url?: string,
    artists: {
        id: string,
        name: string
    }[],
   
    albumImage?: {
        width: number,
        heigth: number,
        url: string
    }
}