FROM node:20

WORKDIR /usr/app

COPY package.json .
RUN npm install

COPY src/ ./src/
COPY index.js .
COPY public ./public/

EXPOSE 8080

CMD ["npm", "start"]




