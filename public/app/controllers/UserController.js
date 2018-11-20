angular.module('UserController', []).controller('RegisterControl', function() {
    function json(response){
        return response.json();
    } 
    
    let register = document.forms.register;
    let message = document.querySelector('.err-msg');
    
    register.addEventListener('submit', (ev) => {
        ev.preventDefault();
        let username = register.elements.username;
        let email = register.elements.email;
        let password = register.elements.password;
        let url = '/api/register';
        fetch(url, {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `username=${username.value}&email=${email.value}&password=${password.value}`,
            credentials: 'include'
        })
        .then(json)
        .then((data) => {
            if (status === 'ok'){
                message.innerHTML = `<div class="alert alert-primary" role="alert">${data.message}</div>`;
                register.reset();   
            }
            else message.innerHTML = `<div class="alert alert-danger" role="alert">${data.message}</div>`;
        })
        .catch((error) => {
            console.log('Request failed', error);
        });
    });
});