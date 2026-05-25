## Ziel

Erstelle eine moderne Webseite mit HTML, CSS und JavaScript.

Die Webseite soll responsive sein und sich automatisch an Mobile- und Desktop-Bildschirme anpassen.

Die Webseite muss ohne Frameworks funktionieren.

## Technologien

Verwende nur:

- HTML
- CSS
- JavaScript

Keine Frameworks verwenden.

Nicht verwenden:

- React
- Vue
- Angular
- Bootstrap
- Tailwind
- jQuery

## Webseite

Die Webseite soll mit normalen Browser-Technologien funktionieren.

Die Webseite soll sauber aufgebaut sein und sowohl auf Mobile als auch auf Desktop gut aussehen.

Die Webseite soll dynamisch auf die Breite des Browserfensters reagieren.

## Responsive Verhalten

Die Webseite muss anhand der verfügbaren Browserbreite entscheiden, welches Layout angezeigt wird.

Das bedeutet:

- kleine Breite = Mobile Layout
- grosse Breite = Desktop Layout

Die Umsetzung soll hauptsächlich mit CSS Media Queries erfolgen.

JavaScript darf zusätzlich verwendet werden, wenn es für dynamisches Verhalten sinnvoll ist.

Beispiel:

```css
@media (max-width: 768px) {
  /* Mobile Layout */
}

@media (min-width: 769px) {
  /* Desktop Layout */
}
```

## Icons

Verwende keine einfachen Standardicons oder Platzhaltericons.

Für Icons sollen schöne, moderne Icons verwendet werden.

Erlaubt sind zum Beispiel:

- SVG Icons
- Icon-Bibliotheken über CDN
- moderne freie Icon-Sets

Die Icons sollen optisch zur Webseite passen.

Icons dürfen als Assets im Ordner `assets/` liegen.

Icon-Pfade sollen ebenfalls über `assets.json` verwaltet werden, wenn sie lokal gespeichert sind.

## Texte

Sämtliche Texte der Webseite müssen ausgelagert sein.

Texte dürfen nicht direkt im HTML hardcodiert werden.

Alle Texte müssen in einer separaten JSON-Datei gespeichert werden.

Die Datei muss so heissen:

```text
text.json
```

Das JSON soll mit Key-Value-Pairs aufgebaut sein.

Beispiel:

```json
{
  "heroTitle": "Willkommen auf meiner Webseite",
  "heroSubtitle": "Dies ist ein Beispieltext",
  "buttonText": "Mehr erfahren",
  "navHome": "Home",
  "navAbout": "Über mich",
  "navContact": "Kontakt"
}
```

Die Webseite soll die Texte aus `text.json` laden und an den passenden Stellen anzeigen.

Wenn später ein Value in `text.json` geändert wird, soll sich der Text auf der Webseite automatisch ändern, ohne dass das HTML angepasst werden muss.

## Assets

Sämtliche Assets der Webseite müssen zentral verwaltet werden.

Alle Assets müssen in einem separaten Ordner liegen:

```text
assets/
```

Alle Asset-Pfade müssen in einer separaten JSON-Datei gespeichert werden.

Die Datei muss so heissen:

```text
assets.json
```

Das JSON soll mit Key-Value-Pairs aufgebaut sein.

Alle lokalen Asset-Pfade müssen mit `assets/` beginnen.

Beispiel:

```json
{
  "logo": "assets/logo.svg",
  "heroImage": "assets/hero-image.jpg",
  "backgroundImage": "assets/background.png",
  "iconMenu": "assets/icon-menu.svg",
  "iconClose": "assets/icon-close.svg"
}
```

Die Webseite soll die benötigten Assets aus `assets.json` laden und an den passenden Stellen verwenden.

Asset-Pfade dürfen nicht direkt im HTML hardcodiert werden.

Wenn später ein Value in `assets.json` geändert wird, soll sich das verwendete Asset auf der Webseite automatisch ändern, ohne dass das HTML angepasst werden muss.

## HTML-Regeln

Im HTML sollen keine finalen Texte hardcodiert werden.

Im HTML sollen keine finalen Asset-Pfade hardcodiert werden.

Das HTML soll nur die Struktur der Webseite enthalten.

Texte sollen über JavaScript aus `text.json` eingefügt werden.

Assets sollen über JavaScript aus `assets.json` eingefügt werden.

Beispiel für HTML-Struktur:

```html
<h1 data-text="heroTitle"></h1>
<p data-text="heroSubtitle"></p>
<button data-text="buttonText"></button>

<img data-asset="heroImage" alt="">
```

## JavaScript-Regeln

JavaScript soll die Dateien `text.json` und `assets.json` laden.

Danach sollen die Inhalte automatisch in die Webseite eingefügt werden.

Elemente mit `data-text` sollen den passenden Text aus `text.json` erhalten.

Elemente mit `data-asset` sollen den passenden Asset-Pfad aus `assets.json` erhalten.

Beispiel:

```javascript
async function loadJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

async function initPage() {
  const texts = await loadJSON('text.json');
  const assets = await loadJSON('assets.json');

  document.querySelectorAll('[data-text]').forEach((element) => {
    const key = element.getAttribute('data-text');

    if (texts[key]) {
      element.textContent = texts[key];
    }
  });

  document.querySelectorAll('[data-asset]').forEach((element) => {
    const key = element.getAttribute('data-asset');

    if (assets[key]) {
      element.src = assets[key];
    }
  });
}

initPage();
```

## CSS-Regeln

CSS soll sauber strukturiert sein.

Die Webseite soll auf Mobile und Desktop gut lesbar und nutzbar sein.

Das Layout soll responsive sein.

Verwende sinnvolle Breakpoints.

Beispiel:

```css
/* Basis-Layout für Mobile */
.container {
  width: 100%;
  padding: 16px;
}

/* Desktop Layout */
@media (min-width: 769px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px;
  }
}
```

## Dateistruktur

Die Webseite soll sauber strukturiert sein.

Verwende folgende Struktur:

```text
/index.html
/css/style.css
/js/main.js
/text.json
/assets.json
/assets/
```

## Anforderungen an den Code

Der Code soll:

- einfach verständlich sein
- sauber eingerückt sein
- gut kommentiert sein
- wartbar sein
- keine unnötigen Abhängigkeiten enthalten
- keine Frameworks verwenden
- auf Mobile gut funktionieren
- auf Desktop gut funktionieren

## Wichtig

Texte nicht direkt ins HTML schreiben.

Assets nicht direkt ins HTML hardcoden.

Alle Texte müssen aus `text.json` kommen.

Alle Asset-Pfade müssen aus `assets.json` kommen.

Alle lokalen Assets müssen im Ordner `assets/` liegen.

Alle lokalen Asset-Pfade müssen mit `assets/` beginnen.

Das Layout muss responsive sein.

Die Webseite muss anhand der Browserbreite zwischen Mobile und Desktop Layout wechseln.

Keine Frameworks verwenden.

Icons sollen modern und hochwertig wirken.

Die Webseite soll mit HTML, CSS und JavaScript funktionieren.
