FROM node:18-alpine

WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install --production

# copy app source
COPY . .

# default port used by the app; can be overridden by compose or .env
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
