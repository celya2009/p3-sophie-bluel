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
