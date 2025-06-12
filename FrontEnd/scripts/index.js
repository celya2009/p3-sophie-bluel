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

const token = localStorage.getItem("token"); // récupère ton token connecté

async function loadModalGallery() {
  const container = document.querySelector(".modal-gallery-container");
  container.innerHTML = ""; // Vide la galerie avant de charger

  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  works.forEach(work => {
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
        item.remove(); // Supprime du DOM
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
