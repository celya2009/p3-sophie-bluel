const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Création du message d'erreur
const errorMessage = document.createElement("p");
errorMessage.style.color = "red";
form.appendChild(errorMessage);

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Empêche le rechargement de la page

  const user = {
    email: emailInput.value,
    password: passwordInput.value
  };

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    const data = await response.json();
    console.log("Réponse serveur login:", data);


    if (response.ok) {
      // Stockage du token
      localStorage.setItem("token", data.token);

      // Redirection vers la page d’accueil
      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Email ou mot de passe incorrect.";
    }
  } catch (error) {
    errorMessage.textContent = "Erreur de connexion au serveur.";
    console.error(error);
  }
});
