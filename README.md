# MASTER M&A — Website

Statische website voor MASTER M&A, gebouwd in pure HTML/CSS/JS zonder frameworks.

## Structuur

```
master-ma/
├── index.html              → Homepage
├── waarde.html             → Waardering & Value Scan
├── kopen.html              → Aankoop & Buy-side traject
├── verkopen.html           → Verkoop & Deal Check
├── aandeelhouders.html     → Aandeelhouderskwesties
├── continuiteit.html       → Continuity & herstructurering
├── diensten.html           → Alle diensten & prijzen (9 producten)
├── master-advocaten.html   → Samenwerking met MASTER Advocaten
├── over-ons.html           → Over MASTER M&A
├── werkwijze.html          → Vier-stappen werkwijze
├── inzichten.html          → Content hub, boeken, tools
├── contact.html            → Intake formulier
├── privacy.html            → Placeholder — in te vullen door Master Advocaten
├── cookies.html            → Placeholder — in te vullen door Master Advocaten
├── algemene-voorwaarden.html  → Placeholder — in te vullen door Master Advocaten
├── disclaimer.html         → Placeholder — in te vullen door Master Advocaten
├── css/shared.css          → Design system (Fraunces + Inter, diepblauw #1E3A5F)
├── js/shared.js            → Mobile menu + scroll-reveal + year
├── assets/                 → (leeg — logo's, foto's later toevoegen)
└── docs/                   → (leeg — PDF's, checklists, boek-downloads later)
```

## Design system

- **Kleuren**: warm white `#F8F6F1`, charcoal `#1F2937`, accent diepblauw `#1E3A5F`, warn rood `#B85450`
- **Typografie**: Fraunces (display serif) + Inter (body sans) — Google Fonts
- **Layout**: mobile-first, responsive vanaf 320px, container 1280px max
- **Geen frameworks**: pure HTML/CSS/JS, snel laadt, SEO-vriendelijk

## Placeholders om in te vullen vóór live gaan

Zoek en vervang deze in alle HTML files:

- `[BEDRIJFSNAAM]` → BV-naam
- `[STRAAT + NUMMER]` → adres
- `[POSTCODE + GEMEENTE]` → postcode
- `[BTW-NUMMER]` → BTW-nummer
- `[DATUM]` → datum juridische pagina's (bv. "31 augustus 2026")
- `REPLACE_WITH_FORMSPREE_ID` → in contact.html, uw Formspree form-ID
- `masteradvocaten.be` → definitief domein Master Advocaten (nu op meerdere plaatsen)

## Deployment

Aanbevolen: GitHub + Vercel (zie deployment guide) met domein `masterma.be`.

## Contact

- Website: masterma.be (nog te registreren)
- Bouwd door Ruben De Ruyck
