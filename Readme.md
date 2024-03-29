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

## Running on Production

- Build server

  ```bash
  > npm run build
  ```

- Start server

  ```bash
  > npm start
  ```

- Server running on `127.0.0.1:4000`

## Running on Development

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

- Local: `https://127.0.0.1:4000`
- Hosting: [https://zerachiuw.my.id](https://zerachiuw.my.id)

## API URL

- Local: `http://127.0.0.1:4000/api`
- Hosting: [https://zerachiuw.my.id/api](https://zerachiuw.my.id/api)

## Documentation URL

- Use swagger schema `http` in localhost
- `http://127.0.0.1:4000/docs`
- Use swagger schema `https` in hosting
- [https://zerachiuw.my.id/docs](https://zerachiuw.my.id/docs)

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
