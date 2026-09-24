# lespanseurs.org

Site de l'association **Les Panseurs**. Publié automatiquement sur GitHub Pages
à chaque modification de la branche `main`.

Direction artistique : **« Le Pansement »**. Le fond est un corps noir, les
contenus sont des bandes de gaze posées dessus, et les bandelettes qui traversent
les titres inversent les lettres qu'elles recouvrent. Tout est en CSS : aucune
image de décor, aucune police à télécharger.

---

## Modifier le contenu sans toucher au design

Les textes et les chiffres vivent dans `src/_data/`. Ce sont des fichiers `.json` :
du texte entre guillemets, une virgule entre chaque ligne. Modifier l'un de ces
fichiers suffit, le site se met à jour partout où l'information apparaît.

| Fichier | Ce qu'il contient |
|---|---|
| `site.json` | Nom, e-mails, téléphone, Instagram, RNA, SIREN, adresse, domaine |
| `nav.json` | Les cinq rubriques et leur ordre |
| `projets.json` | Les expositions : date, lieu, titre, description, mots-clés |
| `gouvernance.json` | Les membres du bureau et leur fonction |
| `finances.json` | Les comptes : postes et montants. **Les totaux et les pourcentages sont calculés tout seuls** — il n'y a rien à recalculer à la main |
| `photos.json` | Généré automatiquement, ne pas modifier |

Les textes plus longs et propres à une seule page (la vision, la mission) sont
dans le fichier `.njk` de la page correspondante, au milieu du HTML.

## Ajouter une photo

1. Déposer la photo dans `photos-sources/` (l'original pleine résolution, tel
   quel — inutile de le réduire).
2. L'ajouter à la liste `SOURCES` au début de `tools/optimize-images.mjs`.
3. Lancer :

```bash
npm run images
```

Le script fabrique toutes les tailles et tous les formats nécessaires dans
`src/assets/img/`, et met à jour `src/_data/photos.json`. Il faut ensuite
appeler la photo depuis une page, ou l'ajouter à `projets.json`.

## Travailler sur le site

```bash
npm install
npm start
```

Le site s'ouvre sur `http://localhost:8080` et se recharge à chaque
enregistrement.

Pour fabriquer le site sans le servir :

```bash
npm run build
```

Le résultat atterrit dans `_site/`. Ce dossier n'est pas versionné : c'est
GitHub qui le reconstruit.

## Publier

Il n'y a rien à faire : tout envoi sur la branche `main` déclenche la
reconstruction et la mise en ligne (`.github/workflows/deploy.yml`). L'onglet
**Actions** du dépôt montre l'avancement et signale une éventuelle erreur.

> La source de publication (*Settings → Pages*) est **GitHub Actions** : elle a
> basculé toute seule au premier passage du workflow, l'ancienne publication par
> branche ne tourne plus. Le nom de domaine `lespanseurs.org` est inchangé : il
> est porté par le fichier `CNAME`, recopié à chaque construction.

## Comment c'est fait

- [Eleventy](https://www.11ty.dev/) transforme `src/` en pages HTML. Aucun autre
  outil, aucun framework côté navigateur.
- Les adresses des pages sont **identiques à celles de l'ancien site**
  (`/a-propos.html`, `/projets.html`, `/transparence.html`, `/contact.html`) :
  les liens déjà partagés continuent de fonctionner.
- Le JavaScript est facultatif. Sans lui, le site reste entièrement lisible et
  navigable — le sommaire est un `<details>` natif, et les liens sont des liens.
- Les contrastes de la palette ont été mesurés et sont notés en commentaire en
  tête de `src/assets/css/pansement.css`. Deux variantes existent pour les fonds
  clairs (`--sang-sombre`) et pour le texte sur fond noir (`--iode-clair`) :
  les utiliser plutôt que les couleurs vives, qui ne passent pas le seuil de
  lisibilité en petit corps.
- Les animations se coupent d'elles-mêmes si le système demande un mouvement
  réduit, et la mise en page bascule en mode sobre en contraste forcé et à
  l'impression.

## Structure

```
src/
  _data/            les contenus éditables
  _includes/        gabarit, en-tête, pied de page, macro photo
  assets/           feuille de style, script, images générées, favicon
  *.njk             les pages
photos-sources/     les photos d'origine, pleine résolution (non publiées)
tools/              préparation des images
```
