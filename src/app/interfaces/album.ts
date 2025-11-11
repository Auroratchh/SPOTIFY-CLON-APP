import { Image } from "./image";
import { Track } from "./track";

export interface Album {
    id: string,
    name: string,
    total_tracks: number,
    href: string,
    images: Image[],
    tracks: Track[]
}
