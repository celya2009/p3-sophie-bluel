const gallery = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters');

let allWorks = [];

async function fetchWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    allWorks = works;
    displayWorks(allWorks);
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}

async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    createFilterButtons(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

function displayWorks(works) {
  gallery.innerHTML = '';
  works.forEach(work => {
    const figure = document.createElement('figure');
    
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

function createFilterButtons(categories) {
  // Bouton "Tous"
  const allBtn = document.createElement('button');
  allBtn.textContent = 'Tous';
  allBtn.classList.add('active');
  allBtn.addEventListener('click', () => {
    setActiveButton(allBtn);
    displayWorks(allWorks);
  });
  filtersContainer.appendChild(allBtn);

  // Boutons pour chaque catégorie
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.textContent = category.name;
    btn.addEventListener('click', () => {
      setActiveButton(btn);
      const filtered = allWorks.filter(work => work.categoryId === category.id);
      displayWorks(filtered);
    });
    filtersContainer.appendChild(btn);
  });
}

function setActiveButton(activeBtn) {
  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

// Lancer les requêtes
fetchWorks();
fetchCategories();

const modal = document.getElementById("modal");
const btnModifier = document.getElementById("btn-modifier");
const btnClose = document.getElementById("modal-close");

const galleryView = document.getElementById("modal-gallery");
const addPhotoView = document.getElementById("modal-add-photo");
const btnOpenAddPhoto = document.getElementById("open-add-photo");
const btnBackToGallery = document.getElementById("back-to-gallery");


// Ouvre la modale sur la vue galerie
btnModifier.addEventListener("click", () => {
  modal.classList.remove("hidden");
  galleryView.classList.remove("hidden");
  addPhotoView.classList.add("hidden");
});

// Ferme la modale au clic sur la croix
btnClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Ferme la modale au clic en dehors du contenu
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// Passage de la galerie à la vue ajout photo
btnOpenAddPhoto.addEventListener("click", () => {
  galleryView.classList.add("hidden");
  addPhotoView.classList.remove("hidden");
});

// Retour de la vue ajout photo à la galerie
btnBackToGallery.addEventListener("click", () => {
  addPhotoView.classList.add("hidden");
  galleryView.classList.remove("hidden");
});

async function deleteWork(id, figureElement) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Supprimer du DOM si la suppression a réussi
      figureElement.remove();
    } else if (response.status === 401) {
      console.error("Non autorisé : token manquant ou invalide.");
    } else {
      console.error("Erreur lors de la suppression :", response.status);
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
}

async function loadModalGallery() {
  const container = document.querySelector(".modal-gallery-container");
  container.innerHTML = ""; // Vide la galerie avant de charger

  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  allWorks.forEach(work => {
    const item = document.createElement("div");
    item.classList.add("gallery-item");
    item.dataset.id = work.id;

    item.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <button class="btn-delete" aria-label="Supprimer">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;

    // Suppression via API
    item.querySelector(".btn-delete").addEventListener("click", async () => {
      const res = await fetch(`http://localhost:5678/api/works/${work.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        item.remove(); // Supprime du DOM immédiatement sans recharger la page
     allWorks = allWorks.filter(w => w.id !== work.id);
     displayWorks(allWorks);
      } else {
        alert("Erreur lors de la suppression");
      }
    });

    container.appendChild(item);
  });
}

document.querySelector("#btn-modifier").addEventListener("click", () => {
  document.getElementById("modal").classList.remove("hidden");
  loadModalGallery(); // Charge la galerie dans la modale
});

const formAddPhoto = document.getElementById("form-add-photo");

const fileInput = formAddPhoto.getElementById('photo');
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const fileError = document.getElementById('upload-error');
    const titleError = document.getElementById('title-error');

    // Vérifier si l'image est en jpg ou png
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      fileError.innerText = 'Veuillez importer une image (JPEG ou PNG)';
      fileError.style.display = 'block';
      return;
    }

    // Vérifier si la taille de l'image est inférieure à 4Mo
    const maxSizeMB = 4;
    const maxSizeMO = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeMO) {
      fileError.innerText = 'Veuillez importer une image inférieure à 4Mo';
      fileError.style.display = 'block';
      return;
    }

    const reader = new FileReader();
    reader.onload = (element) => {
      const imgPreview = document.getElementById('img-preview');
      const imgUploadZoneContent = document.getElementById(
        'img-upload-zone-content',
      );
      imgPreview.src = element.target.result;
      imgPreview.style.display = 'block';
      imgUploadZoneContent.style.display = 'none';
    };
    reader.readAsDataURL(file);
    fileError.innerText = '';
    enableSubmit(fileError, titleError);
  });


formAddPhoto.addEventListener("submit", async function (e) {
  e.preventDefault();

  const imageInput = document.getElementById("photo");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const errorBox = document.getElementById("form-error");

  // Réinitialisation du message d’erreur
  errorBox.textContent = "";

  const photo = imageInput.files[0];
  const title = titleInput.value.trim();
  const category = categorySelect.value;

  const errors = [];

  if (!photo) {
    errors.push("Veuillez ajouter une photo.");
  } else if (photo.size > 4 * 1024 * 1024) {
    errors.push("La photo dépasse 4 Mo.");
  }

  if (!title) {
    errors.push("Le titre est obligatoire.");
  }

  if (!category) {
    errors.push("Veuillez choisir une catégorie.");
  }

  if (errors.length > 0) {
    errorBox.textContent = errors.join(" ");
    return;
  }

  // Envoi du formulaire
  const formData = new FormData();
  formData.append("image", photo);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
      allWorks.push(newWork); // Mets à jour la liste
      displayWorks(allWorks); // Rafraîchis la galerie
      loadModalGallery(); // Mets à jour la modale

      // Réinitialise le formulaire
      formAddPhoto.reset();
      errorBox.textContent = "";
      alert("✅ Projet ajouté avec succès !");
      addPhotoView.classList.add("hidden");
      galleryView.classList.remove("hidden");
    } else {
      errorBox.textContent = "Erreur lors de l'envoi du projet.";
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
    errorBox.textContent = "Erreur de connexion au serveur.";
  }
});

function addProjectToGallery(project) {
  const gallery = document.querySelector(".gallery");

  const figure = document.createElement("figure");
  figure.setAttribute("data-id", project.id);

  const img = document.createElement("img");
  img.src = project.imageUrl;
  img.alt = project.title;

  const caption = document.createElement("figcaption");
  caption.textContent = project.title;

  figure.appendChild(img);
  figure.appendChild(caption);

  gallery.appendChild(figure);
}

function addProjectToModal(project) {
  const modalGallery = document.querySelector(".modal-gallery");

  const figure = document.createElement("figure");
  figure.setAttribute("data-id", project.id);

  const img = document.createElement("img");
  img.src = project.imageUrl;
  img.alt = project.title;

  // Ici, tu peux aussi ajouter un bouton de suppression si nécessaire
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

  deleteBtn.addEventListener("click", () => {
    // Fonction de suppression ici
  });

  figure.appendChild(img);
  figure.appendChild(deleteBtn);

  modalGallery.appendChild(figure);
}
