# build
FROM node:alpine AS build
WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

COPY . .

RUN npm ci --legacy-peer-deps
RUN npm run build
RUN npm run swagger:gen

# run
FROM node:alpine
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/storages ./storages
COPY --from=build /app/swagger-output.json .
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .

RUN apk add chromium
RUN npm ci --only=production --ignore-scripts --legacy-peer-deps

EXPOSE 4000

CMD [ "node", "dist/server.js" ]
