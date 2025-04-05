FROM node:22.14-bookworm-slim

RUN <<EOF
useradd -ms /bin/sh -u 1001 app
mkdir /app
chown app:app /app
EOF

USER app
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --progress=false

COPY --chown=app:app . .

EXPOSE 3000
