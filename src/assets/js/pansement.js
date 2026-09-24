/**
 * Le geste — couche d'agrément.
 *
 * Rien d'essentiel ici : sans JavaScript, le site reste entièrement lisible et
 * navigable (le sommaire est un <details> natif, les liens sont des liens).
 * Ce fichier ajoute trois choses :
 *   1. le décollement des strates au défilement ;
 *   2. la fermeture du sommaire à la touche Échap et au changement de page ;
 *   3. le blocage du défilement derrière le sommaire ouvert.
 */

const doux = window.matchMedia('(prefers-reduced-motion: reduce)');

/* -- 1. Décollement des strates ------------------------------------------ */

const strates = document.querySelectorAll('.strate, .dossier');

if ('IntersectionObserver' in window && !doux.matches) {
  const guetteur = new IntersectionObserver(
    (entrees) => {
      for (const entree of entrees) {
        if (!entree.isIntersecting) continue;
        entree.target.classList.add('est-decolle');
        guetteur.unobserve(entree.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );

  for (const strate of strates) guetteur.observe(strate);
} else {
  // Pas d'observateur, ou mouvement réduit : tout est décollé d'emblée.
  for (const strate of strates) strate.classList.add('est-decolle');
}

/* -- 2 & 3. Le sommaire --------------------------------------------------- */

const sommaire = document.querySelector('.sommaire');

if (sommaire) {
  const fermer = () => {
    sommaire.open = false;
  };

  // Le sommaire couvre l'écran : le reste de la page est mis hors d'atteinte
  // du clavier et des lecteurs d'écran tant qu'il est ouvert.
  const derriere = [document.querySelector('main'), document.querySelector('.pied')].filter(Boolean);

  sommaire.addEventListener('toggle', () => {
    document.body.classList.toggle('est-bloque', sommaire.open);
    for (const bloc of derriere) bloc.inert = sommaire.open;
    if (sommaire.open) {
      sommaire.querySelector('.sommaire__lien')?.focus({ preventScroll: true });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sommaire.open) {
      fermer();
      sommaire.querySelector('.sommaire__bouton')?.focus();
    }
  });

  // Un clic en dehors du sommaire le referme.
  document.addEventListener('click', (e) => {
    if (sommaire.open && !sommaire.contains(e.target)) fermer();
  });

  // Les transitions de page conservent le DOM un instant : on referme avant.
  window.addEventListener('pageswap', fermer);
  window.addEventListener('pagehide', fermer);
}
