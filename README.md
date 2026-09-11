# MASTER M&A — Website

## v2.1.1 — Blog footer fix

De 11 blog-pagina's in /inzichten/ subfolder hebben nu de juiste
footer met kolommen-layout (voorheen: alles onder elkaar door
verkeerde CSS class-namen in het blog template).

Wat was fout: het blog-template gebruikte `.footer-inner`,
`.footer-top` en `.footer-col` maar de CSS herkent enkel
`.container` (buiten) + `.footer-grid` (grid) + `.footer-brand`
(kolom class). Alle 11 blog-pagina's zijn opnieuw gegenereerd
met de correcte footer-structuur (zelfde als homepage en andere
top-level pagina's, met "../" prefix voor de subfolder).

## Wat te uploaden
De 11 bestanden in /inzichten/ vervangen in GitHub. De andere
pagina's hoeven niet vervangen te worden.
