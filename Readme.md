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
