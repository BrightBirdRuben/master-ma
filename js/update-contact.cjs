const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'meting-upload-opnieuw');
const file = path.join(root, 'contact.html');
let html = fs.readFileSync(file, 'utf8');
html = html.replace('Wat moet er vandaag <em>beslist</em> worden?', 'Een discreet gesprek <em>begint hier.</em>')
  .replace('Beschrijf kort uw onderneming en situatie. We bekijken of een verkennend gesprek zinvol is en welke informatie daarvoor nodig is.', 'Een vraag over de waarde of toekomst van uw onderneming? Bel of mail Ruben rechtstreeks, of laat uw contactgegevens achter. We plannen samen een geschikt moment om uw situatie confidentieel te bespreken.')
  .replace('>Bericht versturen</h3>', '>Vraag een gesprek aan</h3>');
for (const id of ['company', 'kbo', 'timing']) {
  const pattern = new RegExp('<div class="form-row">\\s*<label for="' + id + '">[\\s\\S]*?</div>\\s*');
  if (!pattern.test(html)) throw Error('Missing field ' + id);
  html = html.replace(pattern, '');
}
html = html.replace('id="name" name="name" required', 'id="name" name="name" autocomplete="name" required')
  .replace('id="email" name="email" required', 'id="email" name="email" autocomplete="email" required')
  .replace('Telefoon <span class="required">*</span>', 'Telefoon (optioneel)')
  .replace('id="phone" name="phone" required', 'id="phone" name="phone" autocomplete="tel"')
  .replace('Mijn vraag <span class="required">*</span>', 'Mijn vraag gaat over… (optioneel)')
  .replace('id="topic" name="topic" required', 'id="topic" name="topic"')
  .replace('— Maak een keuze —', 'Kies eventueel een onderwerp')
  .replace('Anders — leg uit in bericht', 'Iets anders')
  .replace('Korte omschrijving van de situatie <span class="required">*</span>', 'Korte toelichting (optioneel)')
  .replace('name="message" required placeholder="Vertel kort waar u vandaag staat. Vermeld geen vertrouwelijke juridische informatie over tegenpartijen."', 'name="message" placeholder="Wat wilt u graag bespreken? U mag dit ook tijdens ons gesprek toelichten."')
  .replace('>Bericht versturen</button>', '>Vraag een gesprek aan</button>')
  .replace('We reageren binnen twee werkdagen. Alle gesprekken vertrouwelijk.', 'Ruben neemt binnen twee werkdagen persoonlijk contact met u op. We spreken samen een geschikt moment af.')
  .replace('>Direct contact</h3>', '>Rechtstreeks met Ruben</h3>')
  .replace('>Privacy en routing</h4>', '>Discreet en onafhankelijk</h4>');
const description = 'Plan een discreet gesprek met Ruben De Ruyck over uw onderneming. Bel, mail of laat uw gegevens achter. We spreken samen een geschikt moment af.';
html = html.replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*(">)/g, '$1' + description + '$2');
html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, start, source, end) => {
  const schema = JSON.parse(source);
  for (const node of schema['@graph']) if (node['@type'] === 'ContactPage') node.description = description;
  return start + '\n' + JSON.stringify(schema, null, 2) + '\n' + end;
});
fs.writeFileSync(file, html);
const scriptFile = path.join(root, 'js/contact.js');
let script = fs.readFileSync(scriptFile, 'utf8');
script = script.replace('Bedankt. Uw bericht is ontvangen. We reageren binnen twee werkdagen.', 'Bedankt voor uw aanvraag. Ruben neemt binnen twee werkdagen persoonlijk contact met u op. Indien gewenst spreken we samen een moment af.')
  .replace("button.textContent = 'Bericht versturen';", "button.textContent = 'Vraag een gesprek aan';")
  .replace("button.textContent = 'Bericht ontvangen';", "button.textContent = 'Aanvraag ontvangen';");
fs.writeFileSync(scriptFile, script);
console.log('Contact page and success message updated; existing Formspree endpoint retained.');

