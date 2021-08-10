export interface KusonimeDownloadResponse {
  resolution: string;
  download_list: Array<KusonimeDownloadListResponse>;
}

export interface KusonimeDownloadListResponse {
  download_link?: string;
  downloader: string;
}

export interface NeonimeDownloadResponse {
  resolution: string;
  server: Array<NeonimeDownloadListResponse>;
}

export interface NeonimeDownloadListResponse {
  name: string;
  link?: string;
}

export interface NekopoiDownloadResponse {
  title: string;
  download_link: Array<NekopoiDownloadListResponse>;
}

export interface NekopoiDownloadListResponse {
  server: string;
  link?: string;
}

export interface MangaDownloadResponse {
  date: string;
  title: string;
  link?: string;
}
