FROM node:alpine

RUN addgroup app && adduser -S -G app app
RUN mkdir /frontend-react-js && chown app:app /frontend-react-js
USER app

WORKDIR /frontend-react-js


COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start"]
