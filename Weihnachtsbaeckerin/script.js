
const kalender = document.getElementById("adventskalender");

const leseFenster = document.getElementById("lese-fenster");
const seitenBild = document.getElementById("kapitel-seitenbild");
const seitenzahl = document.getElementById("seitenzahl");
const zurueckButton = document.getElementById("seite-zurueck");
const weiterButton = document.getElementById("seite-weiter");
const leseSchliessen = document.getElementById("lese-schliessen");

let aktuelleSeite = 1;
const anzahlSeiten = 8;

function zeigeSeite() {
  seitenBild.src = `kapitel/kapitel-1-seite-${aktuelleSeite}.png`;
  seitenBild.alt = `Kapitel 1, Seite ${aktuelleSeite}`;
  seitenzahl.textContent = `Seite ${aktuelleSeite} von ${anzahlSeiten}`;

  zurueckButton.disabled = aktuelleSeite === 1;
  weiterButton.disabled = aktuelleSeite === anzahlSeiten;
  lesezeichenAktualisieren();
}


function oeffneLesefenster() {
  const lesezeichen = lesezeichenLaden();

  if (
    lesezeichen &&
    lesezeichen.kapitel === 1 &&
    Number.isInteger(lesezeichen.seite) &&
    lesezeichen.seite >= 1 &&
    lesezeichen.seite <= anzahlSeiten
  ) {
    aktuelleSeite = lesezeichen.seite;
  } else {
    aktuelleSeite = 1;
  }

    zeigeSeite();
  leseFenster.showModal();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      leseKopfAusrichten();
    });
  });
}

function schliesseLesefenster() {
  leseFenster.close();
  seitenBild.src = "";
}

for (let nummer = 1; nummer <= 24; nummer++) {
  const plaetzchen = document.createElement("button");

  plaetzchen.type = "button";
  plaetzchen.className = "plaetzchen plaetzchen-mit-bild";
  plaetzchen.setAttribute("aria-label", `Kapitel ${nummer} öffnen`);

  plaetzchen.innerHTML = `
    <img
      src="bilder/plaetzchen-${nummer}.png"
      alt="Plätzchen ${nummer}"
      class="plaetzchen-bild"
    >
  `;

  plaetzchen.addEventListener("click", () => {
    if (nummer === 1) {
      oeffneLesefenster();
    } else {
      alert("Dieses Kapitel wird bald verfügbar sein.");
    }
  });

  kalender.appendChild(plaetzchen);
}

zurueckButton.addEventListener("click", () => {
  if (aktuelleSeite > 1) {
    aktuelleSeite--;
    zeigeSeite();
  }
});

weiterButton.addEventListener("click", () => {
  if (aktuelleSeite < anzahlSeiten) {
    aktuelleSeite++;
    zeigeSeite();
  }
});

leseSchliessen.addEventListener("click", schliesseLesefenster);

leseFenster.addEventListener("click", (event) => {
  if (event.target === leseFenster) {
    schliesseLesefenster();
  }
});

const lesezeichenKnopf = document.getElementById("lesezeichen-speichern");
const lesezeichenStatus = document.getElementById("lesezeichen-status");
const kapitelUeberschrift = document.getElementById("kapitel-ueberschrift");


const lesezeichenSchluessel = "weihnachtsbaeckerin-lesezeichen";

function lesezeichenLaden() {
  try {
    const gespeichert = localStorage.getItem(lesezeichenSchluessel);
    return gespeichert ? JSON.parse(gespeichert) : null;
  } catch (fehler) {
    console.error("Lesezeichen konnte nicht geladen werden:", fehler);
    return null;
  }
}

function lesezeichenAktualisieren() {
  const lesezeichen = lesezeichenLaden();

  const istGespeichert =
    lesezeichen !== null &&
    lesezeichen.kapitel === 1 &&
    lesezeichen.seite === aktuelleSeite;

  lesezeichenKnopf.setAttribute(
    "aria-pressed",
    String(istGespeichert)
  );

  lesezeichenKnopf.textContent = istGespeichert
    ? "🔖 Lesezeichen entfernen"
    : "🔖 Lesezeichen setzen";
}

function lesezeichenSpeichern() {
  const lesezeichen = lesezeichenLaden();

  const istBereitsGespeichert =
    lesezeichen !== null &&
    lesezeichen.kapitel === 1 &&
    lesezeichen.seite === aktuelleSeite;

  try {
    if (istBereitsGespeichert) {
      localStorage.removeItem(lesezeichenSchluessel);
    } else {
      localStorage.setItem(
        lesezeichenSchluessel,
        JSON.stringify({
          kapitel: 1,
          seite: aktuelleSeite
        })
      );
    }

    lesezeichenAktualisieren();
  } catch (fehler) {
    console.error("Lesezeichen konnte nicht geändert werden:", fehler);

    if (lesezeichenStatus) {
      lesezeichenStatus.textContent =
        "Das Lesezeichen konnte nicht geändert werden.";
    }
  }
}

lesezeichenKnopf.addEventListener("click", lesezeichenSpeichern);


function gespeicherteSeiteOeffnen() {
  const lesezeichen = lesezeichenLaden();

  if (
    lesezeichen &&
    lesezeichen.kapitel === 1 &&
    Number.isInteger(lesezeichen.seite) &&
    lesezeichen.seite >= 1 &&
    lesezeichen.seite <= anzahlSeiten
  ) {
    aktuelleSeite = lesezeichen.seite;
  } else {
    aktuelleSeite = 1;
  }

seitenzahl.textContent = `Seite ${aktuelleSeite} von ${anzahlSeiten}`;
lesezeichenAktualisieren();
}
function leseKopfAusrichten() {
  const bild = document.querySelector("#kapitel-seitenbild");
  const kopf = document.querySelector("#lese-fenster .lese-kopf");
  const aktionen = document.querySelector("#lese-fenster .lese-aktionen");

  if (!bild || !kopf || !aktionen || !bild.naturalWidth) return;

  const b = bild.getBoundingClientRect();
  const a = aktionen.getBoundingClientRect();

  // Tatsächliche Breite der sichtbaren Kapitelbox ermitteln
  const stil = getComputedStyle(kopf, "::before");
  const kapitelBreite =
    parseFloat(stil.width) +
    parseFloat(stil.paddingLeft) +
    parseFloat(stil.paddingRight) +
    parseFloat(stil.borderLeftWidth) +
    parseFloat(stil.borderRightWidth);

  const links = b.left - kapitelBreite - kopf.getBoundingClientRect().left;
  const rechts = a.left - b.right;
  const abstand = Math.max(8, Math.min(links, rechts));

  kopf.style.position = "fixed";
  kopf.style.top = `${b.top}px`;
  kopf.style.left = `${b.left - kapitelBreite - abstand}px`;
  kopf.style.width = `${kapitelBreite + abstand + b.width + abstand + a.width}px`;
  kopf.style.padding = "0";
  kopf.style.margin = "0";
  kopf.style.justifyContent = "initial";
  kopf.style.gap = "0";

  aktionen.style.position = "absolute";
  aktionen.style.left = `${kapitelBreite + abstand + b.width + abstand}px`;
  aktionen.style.right = "auto";
}

window.addEventListener("resize", leseKopfAusrichten);
document.querySelector("#kapitel-seitenbild")
  ?.addEventListener("load", leseKopfAusrichten);