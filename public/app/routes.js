let app = angular.module('appRoutes', ['ngRoute'])
.config(($routeProvider, $locationProvider) => {
    $routeProvider.when('/', {
        templateUrl: 'app/views/pages/home.html'
    })
    .when('/register', {
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'RegisterControl',
        controllerAs: 'register',
        isLoggedIn: false
    })
    .when('/login', {
        templateUrl: 'app/views/pages/users/login.html',
        isLoggedIn: false
    })
    .when('/logout', {
        templateUrl: 'app/views/pages/users/logout.html',
        isLoggedIn: true
    })
    .when('/profile', {
        templateUrl: 'app/views/pages/users/profile.html',
        isLoggedIn: true
    })
    .when('/tasks', {
        templateUrl: 'app/views/pages/tasks/showTasks.html',
        controller: 'TaskControl',
        controllerAs: 'task',
        isLoggedIn: true
    })
    .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.run(['$rootScope', 'Auth', '$location', ($rootScope, Auth, $location) => {
    $rootScope.$on('$routeChangStart',(ev, next, current) => {
        if (next.$$route.isLoggedIn === true) {
            if(!Auth.isLoggedIn()) {
                ev.preventDefault();
                $location.path('/');
            }
        } else if (next.$$route.isLoggedIn === false) {
            if(Auth.isLoggedIn()) {
                ev.preventDefault();
                $location.path('/');
            }
        }
    });
}]);