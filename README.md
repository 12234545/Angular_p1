# Angular_p1
Mini Application Angular - TodoList
<h2>Description du projet</h2>
  Ce projet est une application Angular simple conçue pour les débutants qui souhaitent se familiariser avec les fonctionnalités fondamentales d'Angular. L'application comporte deux fonctionnalités principales : une page d'accueil avec un compteur interactif et une page de gestion de tâches (todos) qui permet d'afficher, filtrer et marquer les tâches comme terminées.
Fonctionnalités

Page d'accueil : 
Affiche un message de bienvenue, un compteur avec des boutons pour incrémenter, décrémenter et réinitialiser, et un champ de saisie qui enregistre les frappes au clavier dans la console.
Page Todos :
Affiche une liste de tâches récupérées depuis une API externe, permet de marquer les tâches comme terminées et offre une fonctionnalité de recherche pour filtrer les tâches.
Navigation :
Une barre de navigation simple pour naviguer entre les différentes pages de l'application.

Technologies et concepts utilisés
Composants Angular

Utilisation de composants autonomes avec imports dans les décorateurs
Séparation des responsabilités avec différents composants (Header, Counter, Greeting, TodoItem)
Templates inline et externes

Fonctionnalités Angular modernes

Utilisation de signal() pour la gestion d'état réactive
Utilisation de input() pour les propriétés d'entrée des composants
Utilisation de output() pour les événements personnalisés
Contrôle de flux avec @if et @for dans les templates

Directives

Création d'une directive personnalisée HighlightCompletedTodoDirective pour mettre en évidence les tâches terminées
Utilisation de directives structurelles et d'attribut

Services et injection de dépendances

Service TodosService pour récupérer les données depuis une API externe
Utilisation de inject() pour l'injection de dépendances

Routage

Configuration des routes avec le chargement paresseux (lazy loading)
Utilisation de RouterLink pour la navigation

Pipes

Création d'un pipe personnalisé FilterTodosPipe pour filtrer les tâches

Formulaires

Utilisation de FormsModule et ngModel pour la liaison bidirectionnelle des données

HTTP

Utilisation de HttpClient pour effectuer des requêtes HTTP vers une API externe

Autres fonctionnalités

Gestion des événements utilisateur
Manipulation de données avec des méthodes array (map, filter)
Gestion des erreurs avec RxJS (catchError)


Comment démarrer

Cloner le dépôt
Exécuter npm install pour installer les dépendances
Lancer l'application avec ng serve
Accéder à http://localhost:4200/ dans votre navigateur

