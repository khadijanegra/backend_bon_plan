# Utiliser l'image officielle Node.js v20.14.0
FROM node:20.14.0

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code de votre application dans le conteneur
COPY . .

# Exposer le port que l'application écoute (port par défaut : 3000)
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
