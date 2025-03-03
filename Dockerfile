# Clearly use the latest LTS version of Node.js
FROM node:20-alpine

# Set working directory clearly
WORKDIR /app

# Clearly copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies clearly
RUN npm install

# Copy rest of the source code clearly
COPY . .

# Build your Next.js app clearly
RUN npm run build

# Expose port 3000 clearly
EXPOSE 3000

# Start Next.js production server clearly
CMD ["npm", "start"]
