function showPage(pageId) {
    // 1. On cible toutes les sections ayant la classe "page"
    const pages = document.querySelectorAll('.page');
    
    // 2. On les cache toutes
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });

    // 3. On affiche la page demandée
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        
        // 4. On remonte en haut de la fenêtre
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Sécurité : Afficher l'accueil par défaut au chargement
window.onload = function() {
    showPage('accueil');
};
