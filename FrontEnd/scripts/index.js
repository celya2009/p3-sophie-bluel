let works = null;
let categories = null;

/**
 * Récupère les projets depuis l'API et les stocke dans la variable works.
 *
 * @returns {Promise<void>}
 */
async function getWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();
    works = data;
  } catch (error) {
    console.error(`Une erreur est survenue : ${error}`);
  }
}

/**
 * Récupère les catégories depuis l'API et les stocke dans la variable categories.
 *
 * @returns {Promise<void>}
 */
async function getCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    const data = await response.json();
    categories = data;
  } catch (error) {
    console.error(`Une erreur est survenue : ${error}`);
  }
}

/**
 * Crée et affiche les projets dans la galerie.
 *
 * @param {Array} worksArray - Tableau d'objets représentant les projets, chaque objet doit contenir :
 *   - imageUrl {string} : URL de l'image du projet
 *   - title {string} : Titre du projet
 */
function displayWorks(worksArray) {
  const gallery = document.querySelector('.gallery');

  for (let i = 0; i < worksArray.length; i++) {
    const project = worksArray[i];

    const projectFigure = document.createElement('figure');
    const projectImg = document.createElement('img');
    projectImg.src = project.imageUrl;
    projectImg.alt = project.title;
    console.log(projectFigure);

    projectFigure.appendChild(projectImg);
    gallery.appendChild(projectFigure);
  }
}

/**
 * Crée les onglets de filtrage par catégories.
 */
function createTabs() {
  const categoriesNames = works.map((work) => work.category.name); // Récupérer les noms de catégories à partir des projets
  const projectsCategories = new Set(categoriesNames); // Créer un ensemble unique de catégories

  const categoriesTabsWrapper = document.querySelector('.tabs'); // Sélectionner le conteneur pour les onglets
  const categoriesTabs = document.createElement('ul'); // Créer une liste pour les onglets
  categoriesTabsWrapper.appendChild(categoriesTabs); // Ajouter la liste aux onglets

  // Créer l'onglet "Tous"
  const categoriesTabAll = document.createElement('li');
  const categoriesTabAllLink = document.createElement('a');
  categoriesTabAllLink.innerText = 'Tous';
  categoriesTabAllLink.classList.add('active'); // Marquer l'onglet "Tous" comme actif par défaut
  categoriesTabAll.appendChild(categoriesTabAllLink);
  categoriesTabs.appendChild(categoriesTabAll);

  // Ajouter les autres onglets de catégories
  projectsCategories.forEach((element) => {
    const categoriesTab = document.createElement('li');
    const categoriesTabLink = document.createElement('a');
    categoriesTabLink.innerText = element;
    categoriesTab.appendChild(categoriesTabLink);
    categoriesTabs.appendChild(categoriesTab);
  });
}

/**
 * Applique le filtrage des projets par catégorie en fonction de l'onglet cliqué.
 */
function filterWorks() {
  const gallery = document.querySelector('.gallery');
  const tabs = document.querySelectorAll('.tabs ul li a');

  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      // Supprimer la classe 'active' de tous les onglets
      tabs.forEach((otherTab) => otherTab.classList.remove('active'));

      // Ajouter la classe 'active' à l'onglet cliqué
      event.target.classList.add('active');

      if (event.target.innerText === 'Tous') {
        gallery.innerHTML = '';
        displayWorks(works);
      } else {
        const worksFiltered = works.filter(
          (work) => work.category.name === event.target.innerText,
        );
        gallery.innerHTML = '';
        displayWorks(worksFiltered);
      }
    });
  });
}

/**
 * Affiche la bannière de mode édition
 */
function createEditBanner() {
  const body = document.querySelector('body');
  const editBanner = document.createElement('div');
  editBanner.id = 'edition-banner';
  const editBannerIcon = document.createElement('img');
  editBannerIcon.src = 'assets/icons/edit.png';
  const editBannerText = document.createElement('p');
  editBannerText.innerText = 'Mode édition';
  body.appendChild(editBanner);
  editBanner.appendChild(editBannerIcon);
  editBanner.appendChild(editBannerText);
  body.style.marginTop = '97px';
}

/**
 * Crée un bouton d'édition pour le portfolio et l'insère dans le DOM.
 */
function createEditButton() {
  const portfolio = document.getElementById('portfolio');
  const tabs = document.querySelector('.tabs');
  const heading = document.querySelector('#portfolio h2');
  const headingWrapper = document.createElement('div');
  headingWrapper.id = 'heading-wrapper';
  const editButton = document.createElement('a');
  editButton.id = 'edit-button';
  const editIcon = document.createElement('img');
  editIcon.src = 'assets/icons/edit-black.png';
  const editText = document.createElement('p');
  editText.innerText = 'modifier';
  portfolio.insertBefore(headingWrapper, tabs);
  editButton.appendChild(editIcon);
  editButton.appendChild(editText);
  headingWrapper.appendChild(heading);
  headingWrapper.appendChild(editButton);
}

/**
 * Modifie le bouton de connexion en bouton de déconnexion et gère le processus de déconnexion.
 */
function changeLoginToLogout() {
  const loginLink = document.getElementById('login-link');
  loginLink.innerText = 'logout';
  loginLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.localStorage.removeItem('token');
    window.location.reload();
  });
}

/**
 * Variables des modales
 */
const modalFirst = document.getElementById('modal-1');
const modalSecond = document.getElementById('modal-2');
const closeButtons = document.querySelectorAll('.modal-button.close');
const modals = document.querySelectorAll('.modal');
const addButton = document.getElementById('add-button');
const previousButton = document.getElementById('previous-button');

/**
 * Affiche la première modale.
 */
function showModal() {
  modalFirst.style.display = 'flex';
}

/**
 * Ferme une modale spécifique.
 * @param {HTMLElement} modalElement - L'élément HTML de la modale à fermer.
 */
function closeModal(modalElement) {
  const targetModal = modalElement;
  targetModal.style.display = 'none';
}

/**
 * Détecte les clics en dehors des modales et les ferme si nécessaire.
 * @param {Event} event - L'événement de clic.
 * @param {HTMLElement} modal - L'élément HTML de la modale à vérifier.
 */
function outsideClick(event, modal) {
  if (!event.target.closest('.modal-content')) {
    closeModal(modal);
  }
}

/**
 * Supprime un projet.
 * @param {number} projectId - L'ID du projet à supprimer.
 */
async function deleteWorks(projectId) {
  const apiUrl = `http://localhost:5678/api/works/${projectId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Echec de suppression du projet avec l'id ${projectId}`);
    }

    console.log(`Le projet avec l'id ${projectId} a été supprimé avec succès`);
  } catch (error) {
    console.error(
      `Erreur de suppression du projet avec l'id ${projectId}:`,
      error,
    );
  }
}

/**
 * Met à jour le contenu du portfolio.
 * @param {Array} worksArray - Un tableau d'objets représentant les œuvres de portfolio.
 */
async function updateContent(worksArray) {
  // Mettre à jour la gallerie du portfolio (.gallery)
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
  displayWorks(worksArray);

  // Mettre à jour les onglets de filtres (.tabs)
  const categoriesTabsWrapper = document.querySelector('.tabs');
  categoriesTabsWrapper.innerHTML = '';
  createTabs(worksArray);
  filterWorks(worksArray);

  // Mettre à jour la galerie de la modale (.modal-gallery)
  const modalGallery = document.querySelector('.modal-gallery');
  modalGallery.innerHTML = '';
  // eslint-disable-next-line no-use-before-define
  createPreviews(worksArray);
}

/**
 * Met à jour le contenu après la suppression d'un projet.
 *
 * @param {string} projectId - L'ID du projet à supprimer.
 */
async function handleDelete(projectId) {
  await deleteWorks(projectId);
  await getWorks();
  updateContent(works);
}

/**
 * Crée les prévisualisations des projets dans la modale.
 */
function createPreviews() {
  const modalGallery = document.querySelector('.modal-gallery');
  works.forEach((project) => {
    const previewWrapper = document.createElement('div');
    previewWrapper.classList.add('preview-wrapper');

    // Créer une img avec la classe "preview-img" et définir sa source
    const previewImg = document.createElement('img');
    previewImg.classList.add('preview-img');
    previewImg.src = project.imageUrl;

    // Créer un div avec la classe "delete-button"
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => handleDelete(project.id));

    // Créer une img pour le bouton de suppression et définir sa source
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/icons/trash-can-solid.svg';

    // Ajouter les éléments à la galerie de la modale
    modalGallery.appendChild(previewWrapper);
    previewWrapper.appendChild(previewImg);
    previewWrapper.appendChild(deleteButton);
    deleteButton.appendChild(deleteIcon);
  });
}

/**
 * Remplit le select avec les catégories des projets.
 */
function fillCategoriesSelect() {
  const categoriesSelect = document.getElementById('category');
  categories.forEach((categorie) => {
    const option = document.createElement('option');
    option.setAttribute('value', categorie.id);
    option.text = categorie.name;
    categoriesSelect.appendChild(option);
  });
}

/**
 * Active le bouton submit si les erreurs sont vides et le titre n'est pas affiché.
 *
 * @param {Element} fileError - L'élément d'erreur du fichier.
 * @param {Element} titleError - L'élément d'erreur du titre.
 */
function enableSubmit(fileError, titleError) {
  const inputSubmitWork = document.getElementById('input-submit-work');
  if (fileError.innerText === '' && titleError.style.display === 'none') {
    inputSubmitWork.removeAttribute('disabled');
    inputSubmitWork.removeAttribute('title');
    inputSubmitWork.classList.remove('button-disabled');
  }
}

/**
 * Vérifie l'image uploadée affiche la prévisualisation et une erreur si nécessaire.
 */
function checkFile() {
  const fileInput = document.getElementById('image');
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
}

/**
 * Vérifie le titre et affiche une erreur si nécessaire.
 */
function checkTitle() {
  const inputTitle = document.getElementById('title');
  const titleError = document.getElementById('title-error');
  const fileError = document.getElementById('upload-error');
  inputTitle.addEventListener('blur', () => {
    if (inputTitle.value === '') {
      titleError.innerText = 'Veuillez ajouter un titre';
      titleError.style.display = 'block';
    } else {
      titleError.style.display = 'none';
    }
    enableSubmit(fileError, titleError);
  });
}

/**
 * Ajoute les interactions aux modales.
 */
function addModalInteractions() {
  // Afficher la première modale au clic sur le bouton "modifier"
  document.querySelector('#edit-button').addEventListener('click', showModal);

  // Fermer la modale au clic en dehors de la modale
  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => outsideClick(event, modal));
  });

  // Fermer la modale au clic sur bouton "fermer"
  closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const modal = event.target.closest('.modal');
      closeModal(modal);
    });
  });

  // Ouvrir la deuxième modale et fermer la première au clic sur bouton "Ajouter une photo"
  addButton.addEventListener('click', () => {
    modalFirst.style.display = 'none';
    modalSecond.style.display = 'flex';
  });

  // Revenir à la première modale depuis la deuxième au clic sur bouton précédent
  previousButton.addEventListener('click', () => {
    modalSecond.style.display = 'none';
    modalFirst.style.display = 'flex';
  });
  createPreviews();
  checkFile();
  checkTitle();
  fillCategoriesSelect();
}

/**
 * Ajoute un projet en envoiant les données du formulaire à l'API.
 */
async function addWork() {
  const form = document.getElementById('add-work-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    console.log(formData);
    const titleInput = document.getElementById('title');
    const fileInput = document.getElementById('image');

    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          accept: 'application/json',
        },
        body: formData,
      });
      console.log(response);
      const result = await response.json();
      console.log('Projet ajouté avec succès :', result);

      // Réinitialiser le formulaire
      titleInput.value = '';
      fileInput.value = '';
      document.getElementById('img-preview').style.display = 'none';
      document.getElementById('img-upload-zone-content').style.display = 'flex';

      // Désactiver le bouton submit
      const inputSubmitWork = document.getElementById('input-submit-work');
      inputSubmitWork.setAttribute('disabled', '');
      inputSubmitWork.setAttribute('title', 'Veuillez remplir tous les champs');
      inputSubmitWork.classList.add('button-disabled');

      // Actualiser le contenu
      await getWorks();
      updateContent(works);
    } catch (error) {
      console.error('Erreur :', error);
      const addProjectError = document.getElementById('add-project-error');
      addProjectError.innerText =
        "Une erreur est survenue lors de l'ajout du projet.";
    }
  });
}

/**
 * Affiche les éléments et les interactions lorsque l'utilisateur est connecté.
 */
async function displayLogged() {
  const token = window.localStorage.getItem('token');
  if (token !== null) {
    createEditBanner();
    createEditButton();
    changeLoginToLogout();
    addModalInteractions();
    await addWork();
  }
}

/**
 * Attends le chargement complet du DOM et exécute les fonctions.
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Attendre la récupération des projets et des catégories
  await getWorks();
  await getCategories();
  createTabs();
  displayWorks(works);
  filterWorks();
  displayLogged();
});
