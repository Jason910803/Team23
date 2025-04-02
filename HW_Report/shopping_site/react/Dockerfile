FROM node:22.14-bookworm-slim

WORKDIR /app
COPY package.json ./
RUN npm install

COPY public ./public
COPY src ./src

EXPOSE 3000
CMD ["npm", "start"]
