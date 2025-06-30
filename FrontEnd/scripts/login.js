const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const buttonWrapper = document.querySelector('.login-buttons-wrapper');
const passwordLink = document.querySelector('.login-buttons-wrapper a');
const alertInfo = document.createElement('p');

/**
 * Vérifier si l'alerte doit être affiché
 */
function checkAlertInfo() {
  if (
    emailError.style.display === 'none' &&
    passwordError.style.display === 'none'
  ) {
    alertInfo.style.display = 'none';
  }
}

/**
 * Vérifier l'email
 */
function checkEmail() {
  const regexEmail = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  const email = inputEmail.value.trim();
  if (email === '' || !regexEmail.test(email)) {
    emailError.innerText = 'Email invalide';
    emailError.style.display = 'block';
    inputEmail.style.border = '2px solid red';
  } else {
    emailError.style.display = 'none';
    inputEmail.style.border = '2px solid transparent';
    checkAlertInfo();
  }
}

/**
 * Vérifier le mot de passe
 */
function checkPassword() {
  const regexPassword = /^.{3,}$/;
  const password = inputPassword.value.trim();
  if (!regexPassword.test(password)) {
    passwordError.innerText = 'Mot de passe invalide';
    passwordError.style.display = 'block';
    inputPassword.style.border = '2px solid red';
  } else {
    passwordError.style.display = 'none';
    inputPassword.style.border = '2px solid transparent';
    checkAlertInfo();
  }
}

/**
 * Vérifier l'email en temps réel
 */
inputEmail.addEventListener('change', () => {
  checkEmail();
});

/**
 * Vérifier le mot de passe en temps réel
 */
inputPassword.addEventListener('change', () => {
  checkPassword();
});

/**
 * Stocker le token dans le localStorage
 */
function setItem(key, value) {
  window.localStorage.setItem(key, value);
}

/**
 * Envoyer la requête POST vers le serveur
 */
async function postLogin() {
  const data = {
    email: inputEmail.value.trim(),
    password: inputPassword.value.trim(),
  };
  console.log(data);
  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage;

      switch (response.status) {
        case 404:
          errorMessage = "L'email n'existe pas.";
          break;
        case 401:
          errorMessage = 'Le mot de passe est incorrect.';
          break;
        default:
          errorMessage = `Erreur inattendue : ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    const userToken = responseData.token;
    setItem('token', userToken);
    window.location.href = '../FrontEnd/index.html';
  } catch (error) {
    alertInfo.innerText = error.message;
    alertInfo.style.color = 'red';
    buttonWrapper.insertBefore(alertInfo, passwordLink);
    alertInfo.style.display = 'block';
  }
}

/**
 * Vérifier les champs et envoyer le formulaire
 */
function submitLogin() {
  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    checkEmail();
    checkPassword();
    if (
      emailError.style.display === 'none' &&
      passwordError.style.display === 'none'
    ) {
      postLogin();
    } else {
      alertInfo.innerText = 'Veuillez remplir tous les champs';
      alertInfo.style.color = 'red';
      buttonWrapper.insertBefore(alertInfo, passwordLink);
    }
  });
}
submitLogin();
