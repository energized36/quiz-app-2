# Use a lightweight Node.js base image (e.g., Node 20 or 22 Alpine)
FROM node:20-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application's source code to the container
COPY . .

# Expose the port your Express app listens on (default is often 3000)
EXPOSE 3000

# Define the command to start your application
CMD ["npm", "start"]