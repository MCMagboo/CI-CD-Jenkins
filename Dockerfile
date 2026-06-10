FROM node:18-alpine

# Install missing library
RUN apk add --no-cache libatomic

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY dist/ ./dist/
COPY src/ ./src/

EXPOSE 3000
CMD ["node", "src/server.js"]
