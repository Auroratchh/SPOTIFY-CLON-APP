export interface Track {
    id: string,
    name: string,
    duration_ms: number,
    href: string,
    preview_url?: string,  // URL de preview de 30 segundos de Spotify
    artists: {
        id: string,
        name: string
    }[],
    // Campo opcional para la imagen del álbum de cada track
    albumImage?: {
        width: number,
        heigth: number,
        url: string
    }
}