angular.module('Wisebatt', ['appRoutes', 'UserController', 'MainController', 'AuthServices', 'TaskController', 'TaskServices'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});