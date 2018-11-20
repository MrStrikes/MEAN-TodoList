angular.module('AuthServices', []).factory('Auth', function($http, AuthToken, $q) {
    let authFactory = {};

    authFactory.login = function(loginData){
        return $http.post('/api/login', loginData)
        .then(data => {
            AuthToken.setToken(data.data.token);
            return data;
        });
    };

    authFactory.isLoggedIn = () => {
        if(AuthToken.getToken()) return true;
        else return false;
    };

    authFactory.logout = () => {
        AuthToken.setToken();
    };

    authFactory.getUser = () => {
        if (AuthToken.getToken()) return $http.post('/api/me');
        else return $q.reject({status: 'failed', message: 'No token found'});
    };
    return authFactory;
})
.factory('AuthToken', function($window) {
    let authTokenFactory = {};

    authTokenFactory.setToken = token => {
        if (token) $window.localStorage.setItem('token', token);
        else $window.localStorage.removeItem('token');
    };

    authTokenFactory.getToken = () => {
        return $window.localStorage.getItem('token');
    };
    return authTokenFactory;
})
.factory('AuthInterceptor', function(AuthToken) {
    let authInterceptorFactory = {};

    authInterceptorFactory.request = config => {
        let token = AuthToken.getToken();
        if (token) config.headers['x-access-token'] = token;
        return config;
    };
    return authInterceptorFactory;
});