FROM node:10.15.1-alpine

# Make the workdir in container to /frontend-react-js
WORKDIR /frontend-react-js

# Copy package.json from host to container ./frontend-react-js
COPY package.json package.json

# Install all packages in package.json in container
RUN npm install

# Copy all files from host to container ./frontend-react-js
COPY . .

#Expose the port you want to serve your app
EXPOSE ${PORT}

# Run the command: `npm start -- --port 8000` to start the app
CMD ["npm", "start"]