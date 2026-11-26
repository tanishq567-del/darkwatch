#Uses a Node.js image.
FROM node:20-alpine 
#Creates a working directory.
WORKDIR /app
#Copies the package file.
COPY package.json .
#Installs dependencies.
RUN npm install
#Copies the backend code.
COPY server.js .
#Copies the dashboard.
COPY public ./public
#Exposes port 3000.
EXPOSE 3000
#Starts the backend.
CMD ["npm", "start"]
