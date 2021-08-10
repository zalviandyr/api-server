export interface Movie2DownloadResponse {
  resolution: string;
  size: string;
  download: Array<Movie2DownloadListResponse>;
}

export interface Movie2DownloadListResponse {
  server: string;
  link?: string;
}

export interface DrakorasiaDownloadResponse {
  resolution: string;
  download_link: Array<DrakorasiaDownloadListResponse>;
}

export interface DrakorasiaDownloadListResponse {
  title: string;
  link?: string;
}

export interface DrakorasiaEpisodeListResponse {
  episode: string;
  downloads: Array<DrakorasiaDownloadResponse>;
}
