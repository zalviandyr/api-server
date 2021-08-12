export default class Filepath {
  static animePicture = {
    loliSFW: './storages/anime/lolisfw.json',
    loliNSFW: './storages/anime/lolinsfw.json',
    shota: './storages/anime/shota.json',
    husbu: './storages/anime/husbu.json',
    inori: './storages/anime/inori.json',
    waifu: './storages/anime/waifu.json',
    yaoi: './storages/anime/yaoi.json',
    animeWallpaper: './storages/anime/anime-wallpaper.json',
  };

  static quotes = {
    quotes: './storages/quotes/quotes.json',
    quotesAgamis: './storages/quotes/quotes-agamis.json',
  };

  static indonesia = {
    kabupatenKota: './storages/indonesia/kabupaten-kota.json',
  };

  static muslim = {
    asmaulHusna: './storages/muslim/asmaul-husna.json',
    wallpaper: './storages/muslim/wallpaper.json',
    doa: {
      ayatKursi: './storages/muslim/doa/ayat-kursi.json',
      harian: './storages/muslim/doa/harian.json',
      tahlil: './storages/muslim/doa/tahlil.json',
      wirid: './storages/muslim/doa/wirid.json',
    },
    nabi: {
      list: './storages/muslim/nabi/list.json',
      kisah: (slugNabi: string): string =>
        `./storages/muslim/nabi/kisah/${slugNabi}.json`,
    },
    shalat: {
      bacaan: './storages/muslim/shalat/bacaan.json',
      niat: './storages/muslim/shalat/niat.json',
    },
  };
}
