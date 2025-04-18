# Javascript Web Project | Play.io

## Description :
Nous avons mis en pratique nos différents cours de javascript, notament la création et la connexion à un serveur express, en créant un site regroupant 3 jeux de société.

Le premier est un sudoku, se jouant en solo et ne nécéssitant pas de serveur, mais qui démontre nos connaissances en javascript.

Le deuxième est un jeu d'échecs, se jouant par 2 et cette fois ci utilisant un service express et des websockets afin de permettre une communication des données entre les joueurs.

Le dernier est un jeu des petits chevaux, se jouant à quatres joueurs, et dont le fonctionnement est similaire aux échecs, mais avec plus de données en transit.

## Fonctionnalitées principales :
L'accès au différents jeux est libre, et pour ceux se jouant à plusieurs, les joueurs sont regroupés sous forme de "salles" et une api déployée en local permet de récupérer ces dernière et les affiches dans des lobby, soient des "salles d'attente".

## Instructions de déploiement :
Deux choix sont possibles pour utiliser le site web :
### Utilisation directe :
Le projet a été mis en ligne sur un serveur. Si vous souhaitez une utilisation directe, vous pouvez passer par ce lien : http://23.88.97.248:8081/
### Déploiement sur votre machine :
Le projet utilise docker pour containeriser les différentes parties du site web, vous pouvez le télécharger et l'installer depuis ce lien si ce n'est pas déjà fait : https://www.docker.com/products/docker-desktop/
(Attention au système d'exploitation). Une fois installé, il vous sera demandé de redémarer votre machine.

Nous avons utilisé les dépendances Express, ws et cors dans notre projet. Pour les installer, il faut :
- Se rendre dans backend/chess (cd backend/chess depuis la racine du projet)
- Executer les commandes suivantes : npm install express | npm install cors | npm install ws
- Réitérer l'opération dans backend/horses

Il ne vous reste plus qu'à compiler le programme avec docker (attention à bien avoir redémaré votre ordinateur après son installation) :
- À la racine, exécutez la commande suivante : docker compose up -d --build

Une fois la compilation finie, il ne vous reste plus qu'à vous rendre à l'adresse suivante : http://localhost:8081/

## Membres du groupe :
Arsène BECQUART - Anaïs MASSON - Tristan DAIX - Cem DURAND