FROM ghcr.io/puppeteer/puppeteer:19.10.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

RUN npm run build

COPY . .

CMD ["node", "dist/index.js"]