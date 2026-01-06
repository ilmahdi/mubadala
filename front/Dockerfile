FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x /app/docker_entry.sh

EXPOSE 3000

CMD ["/bin/sh", "/app/docker_entry.sh"]