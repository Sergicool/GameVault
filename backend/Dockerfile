FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copiar el frontend compilado
COPY --from=build-frontend /app/dist ./public

EXPOSE 3001

CMD ["node", "server.js"]
