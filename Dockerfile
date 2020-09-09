# Read Node image from docker hub
FROM node:12.18.1

# Name of working directory
WORKDIR /app

# Copy both package.json and package-lock.json file
COPY package.json package.json
COPY package-lock.json package-lock.json

# Run npm install command within image's shell
RUN npm install

# Copy the source code
COPY . .

# Expose 4000 port within container
EXPOSE 4000

# Mongo Environment Variable 
ENV MONGO_URL mongodb://mongo:27017

# Run this command to start the server within container
CMD [ "node", "app.js" ]