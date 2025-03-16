# Utiliser Node.js comme base
FROM node:18

# Définir le dossier de travail dans le conteneur
WORKDIR /webapp

# Copier les fichiers du backend
COPY backend/ .

# Installer les dépendances
RUN npm install

# Lancer le serveur
CMD ["node", "server.js"]
