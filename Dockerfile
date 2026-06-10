FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY dist/ ./dist/
COPY src/ ./src/

EXPOSE 3000
CMD ["node", "src/server.js"]
