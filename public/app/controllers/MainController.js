angular.module('MainController', ['AuthServices']).controller('MainControl', function(Auth, $location, $timeout, $rootScope){
    let app = this;
    app.loadMe = false;
    $rootScope.$on('$routeChangeStart', function() {
        if (Auth.isLoggedIn()) {
            Auth.getUser()
            .then(data => {
                app.username = data.data.username;
                app.email = data.data.email;
                app.isLoggedIn = true;
            });
        } else {
            app.username = '';
            app.isLoggedIn = false;
        }
        app.loadMe = true;
    });

    this.login = function(loginData) {
        let message = document.querySelector('.msg');
        Auth.login(app.loginData)
        .then(data => {
            if (data.data.status === 'ok') {
                message.innerHTML = `<div class="alert alert-primary" role="alert">${data.data.message}</div>`;
                $timeout(() => {
                    $location.path('/');
                    app.loginData = '';
                }, 800);
            } else {
                message.innerHTML = `<div class="alert alert-danger" role="alert">${data.data.message}</div>`;
            }
        });
    };
    this.logout = function() {
        Auth.logout();
        $location.path('/logout');
        $timeout(() => {
            $location.path('/');
        }, 800);
    };
});