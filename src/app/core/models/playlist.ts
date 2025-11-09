import { Track } from './track';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  tracks: Track[];
}
