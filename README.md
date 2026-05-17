# StudentFlow

TPTP | GitHub vodič za studente

FET Tuzla | vanr.prof.dr. Samra Mujačić | 2025/2026

## O projektu

StudentFlow je web aplikacija za studente koja povezuje fokus pri učenju, upravljanje stresom i zdrave navike. Na početnoj stranici korisnik bira mod rada (motivisan ili pod stresom), koristi Pomodoro timer, filtrira savjete po temama i gleda lokalni motivacioni video. Stranica sadržaja nudi blog članke, galeriju, tabelu tehnika i interaktivnu mapu slike sa četiri zone (burnout, odmor, disanje, tehnike učenja), a kontakt stranica sadrži formu sa validacijom u JavaScriptu.

## Članovi grupe

| Edina Mustafić | [@edinamustafic12-sudo](https://github.com/edinamustafic12-sudo) | HTML + struktura |
| Edna Čorbadžić | [@crbdzc](https://github.com/crbdzc) | CSS + dizajn |
| Edina Brigić | [@edina-py](https://github.com/edina-py) | JavaScript + logika |

## Tehnologije

- HTML5 (semantička struktura, `lang="bs"`, meta tagovi, `<picture>`, image map, tabele, galerija)
- CSS3 — jedna datoteka `css/tptpstil.css` (bez Bootstrapa/Tailwinda)
  - CSS varijable (`:root`, tamni mod `html[data-theme="dark"]`)
  - Flexbox (navigacija, header, kartice)
  - CSS Grid (kartice — 3 kolone na desktopu)
  - 3 breakpointa: mobilni &lt;600px, tablet 600–900px, desktop &gt;900px
  - Tranzicije, `@keyframes` animacije (`pulsiranje`, `fade-in`), pseudo-klase (`:hover`, `:focus`, `:nth-child`, `::after`)
- JavaScript — jedna datoteka `js/tptpskripte.js` (bez jQuery i drugih biblioteka)
  - Filtriranje kartica bez reloada
  - Tamni/svijetli mod + LocalStorage
  - Validacija kontakt forme (regex)
  - Pomodoro timer, bookmarkovi, responzivni image map, brojač sesija

## Struktura projekta

| Datoteka | Opis |
|---|---|
| `index.html` | Početna: hero, filter kartica, Pomodoro, lokalni video, bočni meni |
| `sadrzaj.html` | Blog, tabela, galerija, image map (4 zone), ugniježđena lista |
| `kontakt.html` | Kontakt forma (6 polja), `<picture>`, bočni meni |
| `css/tptpstil.css` | Stilovi za sve stranice |
| `js/tptpskripte.js` | Sva interaktivna logika |
| `images/` | Ilustracije (PNG + WebP), favicon, `leopard.mp4`, `koala.mp4` |

## Pokretanje

Otvorite `index.html` u pregledniku (lokalni server nije obavezan). Za WebP verzije slika, po potrebi: Python 3 + Pillow (`pip install pillow`).

## AI alati korišteni u projektu
## AI alati korišteni u projektu

U kodu su ostavljeni detaljni komentari na mjestima gdje je AI korišten kao pomoć pri učenju i implementaciji. Sav generisani sadržaj je pregledan, testiran i prilagođen od strane tima kako bi odgovarao arhitekturi i potrebama projekta.

| AI alat | Oblast | Šta je pomoglo (prema komentarima u kodu) |
|---|---|---|
| **Claude** | JavaScript | Funkcija `escapeHtml` za siguran prikaz teksta (XSS zaštita); modul za vođeno disanje pomoću **Web Audio API**-ja. |
| **Claude** | JavaScript | **Regex obrasci** za validaciju emaila i telefona na kontakt formi (objašnjenje sidra `^`, `@`, grupa i flagova). |
| **Claude** | CSS / Koncepti | Objašnjenja za napredna CSS svojstva: `system-ui`, `color-mix`, `aspect-ratio`, fluidni layout (`min()`), `translateX` na draweru, `inset: 0` na overlayu, `tabular-nums` na timeru i specifičnost `[hidden]`. |
| **Copilot** | JavaScript | Arhitektura modula: Korištenje **IIFE** obrasca i **closure-a** za enkapsulaciju i sakrivanje logike motivirajućih kartica. |

---

### Detaljan pregled implementacije i naučenih koncepata

#### 1. Modul za vođeno disanje (Web Audio API)
Implementirana je logika koja omogućava generisanje zvuka direktno u pretraživaču bez potrebe za eksternim audio fajlovima:
* **OscillatorNode:** Generiše čisti sinusni val (`type: "sine"`) na zadanoj frekvenciji za kreiranje umirujućeg tona.
* **GainNode:** Kontroliše jačinu zvuka. Pomoću metode `linearRampToValueAtTime` postignut je postepeni *fade-in* i *fade-out*, čime su izbjegnuti nagli skokovi u zvuku koji bi zvučali kao neugodan "klik".
* **Lazy Loading (`ensureAudio`):** AudioContext se kreira tek pri prvoj stvarnoj interakciji korisnika s interfejsom, jer moderni pretraživači iz sigurnosnih razloga blokiraju automatsko pokretanje zvuka.

#### 2. Modul za motivirajuće kartice (Modularni JS & Enkapsulacija)
Logika za upravljanje i rotaciju kartica organizovana je kroz napredne JavaScript obrasce:
* **IIFE & Closure:** Korištenjem *Immediately Invoked Function Expression* obrasca, funkcija se odmah izvršava i vraća objekt s javnim metodama. Unutrašnje varijable (`idx`, `name`, `rotateTimer`, `templates`) ostaju bezbjedno "sakrivene" unutar *closure-a*, čime je postignuta čista enkapsulacija bez potrebe za klasama.
* **Fleksibilnost šablona:** Varijabla `templates` je realizovana kao niz arrow funkcija koje primaju ime i vraćaju objekt sa tekstom kartice. To omogućava jednostavno dodavanje novih šablona bez ikakve potrebe za mijenjanjem osnovne logike rotacije.

#### 3. Sigurnost, Validacija i UI Fluidnost
* **XSS Zaštita (`escapeHtml`):** Funkcija osigurava da se korisnički unos tretira isključivo kao običan tekst. Redoslijed zamjene je strogo definisan (gdje `&` ide prvi kako bi se izbjeglo dvostruko escapeovanje), čime se sprečava ubacivanje zlonamjernih HTML tagova ili zatvaranje atributa unutar navodnika (`&quot;`).
* **Fluidni CSS:** Kroz projekat su implementirani moderni CSS koncepti poput `color-mix` za dinamičke teme, `tabular-nums` za stabilan prikaz cifara na tajmeru (bez "skakanja" teksta), te `aspect-ratio` i relativne koordinate za responzivni image map koji radi savršeno na svim veličinama ekrana.

*Napomena:* Dio CSS komentara označen je sa `/* AI: ... */` kao podsjetnik na objašnjenja pojedinih svojstava tokom izrade `tptpstil.css`.

## Napomene

- Ilustracije i ikone nalaze se u folderu `images/` (vlastiti/grupni materijal za teme učenja, stresa i Pomodora); dio je konvertovan u WebP radi `<picture>` elementa.
- Video na početnoj stranici: lokalni MP4 fajlovi `images/leopard.mp4` (motivisan mod) i `images/koala.mp4` (stres mod) — reprodukcija preko HTML5 `<video>`, ne YouTube.
- Mapa „Gdje učiti mirno” prikazuje **Tuzla** (Google Maps embed — apsolutni URL).
- Vanjski linkovi (apsolutni URL): GitHub repozitorij grupe, WHO, Healthline, Sleep Foundation, YouTube pretrage i dr. — navedeni u karticama i blog člancima.
- Kontakt forma je demo: poruka se ne šalje na server, već se prikazuje personalizirana poruka nakon uspješne JS validacije.

---

*Markdown sintaksa: `#` je naslov, `##` je podnaslov, `-` je lista, `|` je tabela. GitHub automatski renderuje `.md` datoteke.*
