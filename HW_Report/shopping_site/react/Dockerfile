FROM node:22.14-bookworm-slim

RUN useradd -ms /bin/sh -u 1001 app
USER app

WORKDIR /app
COPY package.json ./
RUN npm install

COPY --chown=app:app . .

EXPOSE 3000
