FROM node:16-alpine as build
WORKDIR /src/app
COPY package.json .

RUN yarn install
COPY . ./
RUN yarn build

# Запуск статики на nginx
FROM nginx:alpine as server
COPY --from=build /src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
