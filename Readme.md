# API Server

## Installation

- Install dependencies

  ```bash
  > npm i
  ```

- Generate swagger documentation

  ```bash
  > npm run swagger:gen
  ```

- Setting .env (Environment)

## Installation on Heroku

- Create App

  ```bash
  > heroku app [app-name]
  ```

- Add Buildpack Puppeteer

  ```bash
  > heroku buildpacks:add jontewks/puppeteer
  ```

- Push into Heroku

  ```bash
  > git push heroku master
  ```

## Production

- Build server

  ```bash
  > npm run build
  ```

- Start server

  ```bash
  > npm start
  ```

- Start development server

  ```bash
  > npm run start:dev
  ```

- Server running on `127.0.0.1:4000`

## Development

- Build server

  ```bash
  > npm run build:dev
  ```

- Build alias path server

  ```bash
  > npm run build:dev:alias
  ```

- Start server

  ```bash
  > npm run start:dev
  ```

- Server running on `127.0.0.1:4000`

## Command

- Linter to check formatting file

  ```bash
  > npm run lint
  ```

- Linter to fix formatting file

  ```bash
  > npm run lint:fix
  ```

## Base URL

`https://zalviandyr-api.herokuapp.com/`

## API URL

`https://zalviandyr-api.herokuapp.com/api`

## Documentation URL

`https://zalviandyr-api.herokuapp.com/docs`

## Endpoint

| Name     | Method | Endpoint         | Query / Body              | Value                                  |
| -------- | ------ | ---------------- | ------------------------- | -------------------------------------- |
| BMKG     | GET    | /info-gempa      | -                         | -                                      |
| BMKG     | GET    | /cuaca           | day (Optional), kabupaten | -                                      |
| Other    | GET    | /kabupaten-kota  | provinsi                  | -                                      |
| Other    | GET    | /covid-indonesia | -                         | -                                      |
| Other    | GET    | /quote-maker     | author, quote             | -                                      |
| Other    | GET    | /meme            | -                         | -                                      |
| Other    | GET    | /translate       | text                      | -                                      |
| Other    | GET    | /bosan           | -                         | -                                      |
| Other    | GET    | /anime-pic       | genre                     | [Genre List](#anime-pic-genre-list)    |
| Other    | GET    | /speech          | lang, text                | [Language List](#speech-language-list) |
| Other    | GET    | /quote           | type                      | [Quote List](#quote-type-list)         |
| Other    | GET    | /what-anime      | limit (Optional), url     | -                                      |
| Other    | GET    | /saweria         | -                         | -                                      |
| Religion | GET    | /jadwal-sholat   | kota                      | -                                      |
| Religion | GET    | /quran           | -                         | -                                      |
| Religion | GET    | /surat           | surat, ayat (Optional)    | -                                      |
| Religion | GET    | /alkitab         | name, chapter, number     | -                                      |
| Scrape   | GET    | /kusonime        | search                    | -                                      |
| Scrape   | GET    | /arti-nama       | nama                      | -                                      |
| Scrape   | GET    | /pasangan        | nama1, nama2              | -                                      |
| Scrape   | GET    | /penyakit        | tanggal (DD-MM-YYYY)      | -                                      |
| Scrape   | GET    | /pekerjaan       | tanggal (DD-MM-YYYY)      | -                                      |
| Scrape   | GET    | /drakorasia      | search                    | -                                      |
| Scrape   | GET    | /lirik           | search                    | -                                      |
| Scrape   | GET    | /movie           | search                    | -                                      |
| Scrape   | GET    | /movie2          | search                    | -                                      |
| Scrape   | GET    | /manga           | keyword                   | -                                      |
| Scrape   | GET    | /wiki            | keyword                   | -                                      |
| Scrape   | GET    | /tiktok          | url                       | -                                      |
| Scrape   | GET    | /neonime         | search                    | -                                      |
| Scrape   | GET    | /nekopoi         | -                         | -                                      |
| Social   | GET    | /fb-video        | url                       | -                                      |
| Social   | GET    | /ig-profile      | username                  | -                                      |
| Social   | GET    | /ig              | url                       | -                                      |
| Youtube  | GET    | /yt-audio        | url                       | -                                      |
| Youtube  | GET    | /yt-video        | url                       | -                                      |
| Youtube  | GET    | /yt-search       | search                    | -                                      |

## Anime-Pic Genre List

| NSFW          | SFW          |
| ------------- | ------------ |
| ass           | neko         |
| bdsm          | sfwfoxes     |
| blowjob       | husbu        |
| cum           | inori        |
| doujin        | lolisfw      |
| feet          | randomsfw    |
| femdom        | shota        |
| foxgirl       | wallpapersfw |
| glasses       |
| hentai        |
| loli          |
| netorare      |
| maid          |
| masturbation  |
| orgy          |
| panties       |
| pussy         |
| school        |
| succubus      |
| tentacles     |
| thighs        |
| uglybastard   |
| uniform       |
| yuri          |
| yaoi          |
| zettaiRyouiki |
| wallpapernsfw |
| randomnsfw    |

## Speech Language List

| Lang | Language  |
| ---- | --------- |
| en   | English   |
| kr   | Korea     |
| jp   | Japanese  |
| es   | Spanish   |
| fr   | French    |
| br   | Brazilian |
| cn   | Mandarin  |
| nl   | Dutch     |
| ar   | Arabic    |
| it   | Italian   |
| de   | German    |

## Quote Type List

| Type   |
| ------ |
| Random |
| Kanye  |
| Agamis |

## Note

- Feel free to contribute and create an issue
