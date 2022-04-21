FROM node:current-alpine
RUN mkdir -p /food-recipes
WORKDIR /food-recipes
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
CMD ["nodemon", "app.js"]