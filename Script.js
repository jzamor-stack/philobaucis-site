// Fonction pour changer de page
function showPage(pageId) {
    // 1. Cacher toutes les pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 2. Afficher la page sélectionnée
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // 3. Remonter en haut de la page automatiquement
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialisation des icônes Lucide (si utilisées)
if (window.lucide) {
    lucide.createIcons();
}