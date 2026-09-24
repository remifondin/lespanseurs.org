/**
 * Configuration Eleventy — lespanseurs.org
 *
 * Le site est écrit dans `src/` et construit dans `_site/`, que GitHub Actions
 * publie sur GitHub Pages. Les adresses des pages sont figées à l'identique de
 * l'ancien site (`/a-propos.html`, `/projets.html`…) pour ne casser aucun lien
 * déjà partagé.
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ CNAME: 'CNAME' });
  eleventyConfig.addWatchTarget('src/assets');

  // 2 323,45 € — espace insécable fine avant l'euro, virgule décimale.
  eleventyConfig.addFilter('euros', (n) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(n)
  );

  // 47,5 %
  eleventyConfig.addFilter('pourcent', (n) =>
    new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(n) + ' %'
  );

  // Part d'une ligne dans son total, en % brut pour les barres CSS.
  eleventyConfig.addFilter('part', (montant, total) => (montant / total) * 100);

  eleventyConfig.addFilter('somme', (lignes) =>
    lignes.reduce((t, l) => t + l.montant, 0)
  );

  eleventyConfig.addFilter('annee', () => new Date().getFullYear());

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
