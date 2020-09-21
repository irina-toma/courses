document.addEventListener('DOMContentLoaded', onload);

function onload() {
    let rForm = document.forms['register-form'];
    let lForm = document.forms['login-form'];
    let signUp = document.getElementById('sign-up');
    let signIn = document.getElementById('sign-in');

    rForm.addEventListener('submit', preventDefaultBehaviour);
    lForm.addEventListener('submit', preventDefaultBehaviour);

    rForm['register'].addEventListener('click', register);
    lForm['login'].addEventListener('click', login);

    signUp.addEventListener('click', toggleSignInSignUp);
    signIn.addEventListener('click', toggleSignInSignUp);
}

function preventDefaultBehaviour(event) {
    event.preventDefault();
}

function login() {
    let lForm = document.forms['login-form'];
    let username = lForm['username'].value;
    let password = lForm['password'].value;
    
    let params = {
        username, password
    };

    doPost('http://localhost:4000/auth/login', params, callbackLogin);
}

function register() {
    let rForm = document.forms['register-form'];
    let name = rForm['fullname'].value;
    let email = rForm['email'].value;
    let username = rForm['username'].value;
    let password = rForm['password'].value;

    let params = {
        name, email, username, password
    }

    doPost('http://localhost:4000/auth/register', params, callbackRegister);
}

function doPost(url, params, callback) {
    let req = new XMLHttpRequest();

    req.open('POST', url);
    req.setRequestHeader('Content-type', 'application/json');
   
    req.send(JSON.stringify(params));
    req.onload = () => {
        callback(JSON.parse(req.response));
    }
}

function toggleSignInSignUp(event) {
    if (event) {
        event.preventDefault();
    }

    let rCard = document.getElementById('register-card');
    let lCard = document.getElementById('login-card');

    rCard.classList.toggle('d-none');
    lCard.classList.toggle('d-none');

    rCard.classList.toggle('d-flex');
    lCard.classList.toggle('d-flex');
}

function callbackLogin(data) {
    if (data.success) {
        localStorage.setItem('token', data.data);

        // look in globals.js for baseURL
        document.location.href = 'index.html';
    } else {
        alert(data.message);
    }
}

function callbackRegister(data) {
    if (data.success) {
        toggleSignInSignUp();
    } else {
        alert(data.message);
    }
}


