FROM node:18-alpine
WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install --production

# App code
COPY . .
EXPOSE 3000
CMD ["npm", "start"]