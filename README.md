# Node Movies

Node Movies est une API qui permet d'avoir une bibliothèque de films et d'avoir une liste de ses films favoris.  
Vous pouvez utilisez ce projet pour creéz une application frontend qui utilise l'API.
Sinon vous pouvez tester l'API avec la documentation.  
Le projet est développé avec NodeJS version 20 donc assurez vous de bien l'avoir installé.
Le framework utilisé est "hapi".

## Démarrer le projet

Clonez le projet.

### Variables d'environements

Dans le dossier "server", créez un fichier ".env" et copier le contenu à partir de ".env-keep".
Il faut maintenant configurer les variables pour pouvoir lancer le projet.
Si vous n'avez pas de base de données et de RabbitMQ, vous pourrez les installer dans la partie suivante.

DB_HOST est l'adresse du serveur MySQL  
DB_PORT pour le port de MySQL  
DB_USER pour l'utilisateur MySQL que l'app utilise pour se connecter  
DB_PASSWORD pour le mot de passe qui correspond à l'utilisateur définit à DB_USER  
DB_DATABASE pour le schéma que l'application doit utiliser

MAILER_HOST est l'adresse de votre serveur SMTP qui est utilisé pour l'envoie de mails  
MAILER_PORT pour le port du serveur SMTP  
MAILER_USERNAME pour l'email du compte qui envoie les mails dans l'app  
MAILER_PASSWORD pour le mot de passe du compte définit à MAILER_USERNAME

RABBITMQ_HOST est l'adresse du serveur RabbitMQ

### Installation des logiciels nécessaires

Si vous avez déjà un serveur RabbitMQ et MySQL, vous pouvez sautez cette étape.  
[Installer Docker](https://docs.docker.com/get-docker/) si vous ne l'avez pas (Vous pouvez aussi le faire sans si vous
savez faire).

Installez MySQL en mettant cette comande dans votre terminal:
```shell
docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3307:3306 -d mysql:8 --default-authentication-plugin=mysql_native_password
```
Installez RabbitMQ:
```shell
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
```

Configurer un serveur SMTP pour tester les envois de mail:  
Allez sur [Ethereal](https://ethereal.email/), créez un compte et vous aurez les identifiants que vous pouvez mettre
dans les variables d'environnements. Copier la valeur de "Username' pour "MAILER_USERNAME", la valeur de "Password" pour
"MAILER_PASSWORD", "smtp.ethereal.email" pour "MAILER_HOST" et "587" pour MAILER_PORT.

### Lancer le projet

Copiez les commandes suivantes pour installer les dépendances et faire les migrations:
```shell
npm i
knex migrate:latest
```

Lancement de l'API:
```shell
npm start
```

Lancement du Consumer AMQP:
```shell
node .\rabbitmq\consumer.js
```

## Routes

Vous pouvez accéder à la [documentation](http://localhost:3000/documentation) pour voir les routes.  
Vous pouvez commencer par créer un utilisteur sur "POST /user", modifier le scope user en admin dans la BDD, puis
récupérer un token sur "POST /user/login" en copiant la réponse, cliquez sur Authorize, mettez
"Bearer remplacezParLeTokenQueVousAvezRécupéré". Vou avez maintenant les droits admin pour accéder à toutes les routes.

### Utilisateurs

POST /user pour créer un utilisateur  
DELETE /user/{id} pour supprimer un utilisateur (nécessite d'être admin)  
PATCH /user/{id}  pour modifier un utilisateur (nécessite d'être admin)
POST /user/login pour récupérer un token  
GET /users pour récuper la liste de tous les utilisateurs (nécessite d'être authentifié)

### Films

POST /movie pour créer un film (nécessite d'être admin) Cela envoie un mail à tous utilisateurs.  
DELETE /movie/{id} pour supprimer un film (nécessite d'être admin)  
PATCH /movie/{id} pour modifier un film (nécessite d'être admin) Cela envoie un mail aux utilisateurs qui l'ont en
favoris.  
GET /movies pour récuper la liste de tous les films (nécessite d'être authentifié)
GET /movies/export pour envoyer un CSV par mail contenant tous les films (nécessite d'être admin)

### Films favoris

GET /favouriteMovies pour voir ses films favoris (nécessite d'être authentifié)  
POST /favouriteMovies/{id} pour ajouter un film à ses favoris (nécessite d'être authentifié)  
DELETE /favouriteMovies/{id} pour ajouter un film à ses favoris (nécessite d'être authentifié)
