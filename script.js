// ===================================================
// DATURA 2000 — Planning interactif + formulaire RDV
// ===================================================

const SCHEDULE = {
  "Lundi": [
    { time: "06:00", name: "Arrachage à la fraîche — pour les courageux du matin", full: false },
    { time: "10:00", name: "Ortie & Datura combo — sensations garanties", full: false },
    { time: "14:00", name: "Canicule & Dépassement de soi", full: true },
    { time: "18:00", name: "Session du soir — ampoules garanties", full: false },
  ],
  "Mardi": [
    { time: "06:00", name: "Arrachage à la fraîche — pour les courageux du matin", full: false },
    { time: "14:00", name: "Canicule & Dépassement de soi", full: false },
    { time: "18:00", name: "Session du soir — ampoules garanties", full: true },
    { time: "22:00", name: "Session de nuit sans lampe frontale", full: false },
  ],
  "Mercredi": [
    { time: "06:00", name: "Arrachage à la fraîche — pour les courageux du matin", full: false },
    { time: "10:00", name: "Ortie & Datura combo — sensations garanties", full: true },
    { time: "14:00", name: "Canicule & Dépassement de soi", full: false },
    { time: "18:00", name: "Session du soir — ampoules garanties", full: false },
  ],
  "Jeudi": [
    { time: "06:00", name: "Arrachage à la fraîche — pour les courageux du matin", full: true },
    { time: "14:00", name: "Canicule & Dépassement de soi", full: false },
    { time: "18:00", name: "Session du soir — ampoules garanties", full: false },
    { time: "22:00", name: "Session de nuit sans lampe frontale", full: false },
  ],
  "Vendredi": [
    { time: "06:00", name: "Arrachage à la fraîche — pour les courageux du matin", full: false },
    { time: "10:00", name: "Ortie & Datura combo — sensations garanties", full: false },
    { time: "14:00", name: "Canicule & Dépassement de soi", full: true },
    { time: "22:00", name: "Session de nuit sans lampe frontale", full: false },
  ],
  "Samedi": [
    { time: "08:00", name: "Brunch & Arrachage en famille", full: false },
    { time: "10:00", name: "Ortie & Datura combo — sensations garanties", full: false },
    { time: "14:00", name: "Canicule & Dépassement de soi", full: false },
    { time: "18:00", name: "Session du soir — ampoules garanties", full: true },
  ],
  "Dimanche": [
    { time: "08:00", name: "Brunch & Arrachage en famille", full: true },
    { time: "14:00", name: "Canicule & Dépassement de soi", full: false },
    { time: "22:00", name: "Session de nuit sans lampe frontale", full: false },
  ],
};

const DAYS = Object.keys(SCHEDULE);

const daySelector = document.getElementById("day-selector");
const sessionsList = document.getElementById("sessions-list");
const creneauSelect = document.getElementById("creneau");

function buildDayButtons() {
  DAYS.forEach((day, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "day-btn" + (i === 0 ? " active" : "");
    btn.textContent = day;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
    btn.addEventListener("click", () => selectDay(day, btn));
    daySelector.appendChild(btn);
  });
}

function selectDay(day, btnEl) {
  document.querySelectorAll(".day-btn").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });
  btnEl.classList.add("active");
  btnEl.setAttribute("aria-selected", "true");
  renderSessions(day);
  populateCreneauOptions(day);
}

function renderSessions(day) {
  sessionsList.innerHTML = "";
  SCHEDULE[day].forEach((session) => {
    const item = document.createElement("div");
    item.className = "session-item" + (session.full ? " full" : "");
    item.innerHTML = `
      <span class="session-time">${session.time}</span>
      <span class="session-name">${session.name}</span>
      <span class="session-status">${session.full ? "COMPLET" : "PLACES DISPO"}</span>
    `;
    sessionsList.appendChild(item);
  });
}

function populateCreneauOptions(day) {
  creneauSelect.innerHTML = '<option value="">— Sélectionne un créneau —</option>';
  SCHEDULE[day].forEach((session) => {
    if (session.full) return;
    const opt = document.createElement("option");
    opt.value = `${day} ${session.time} — ${session.name}`;
    opt.textContent = `${day} ${session.time} — ${session.name}`;
    creneauSelect.appendChild(opt);
  });
}

buildDayButtons();
renderSessions(DAYS[0]);
populateCreneauOptions(DAYS[0]);

// ---------- Formulaire RDV ----------
const form = document.getElementById("rdv-form");
const modalOverlay = document.getElementById("modal-overlay");
const modalMessage = document.getElementById("modal-message");
const modalClose = document.getElementById("modal-close");
const modalOk = document.getElementById("modal-ok");

const CONFIRMATIONS = [
  "RDV validé ! Amène tes gants et ta volonté. Le datura, lui, n'attend que toi.",
  "C'est noté ! Le champ t'a déjà repéré. Il n'a pas l'air content.",
  "Inscription confirmée. Prévois une gourde, une serviette, et de quoi pleurer un peu.",
  "RDV pris ! On garde ton créneau au chaud, contrairement à toi qui seras en plein soleil.",
];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const prenom = document.getElementById("prenom").value.trim() || "Champion";
  const msg = CONFIRMATIONS[Math.floor(Math.random() * CONFIRMATIONS.length)];
  modalMessage.textContent = `${prenom}, ${msg.charAt(0).toLowerCase() + msg.slice(1)}`;
  modalOverlay.classList.add("open");
});

function closeModal() {
  modalOverlay.classList.remove("open");
  form.reset();
  populateCreneauOptions(document.querySelector(".day-btn.active")?.textContent || DAYS[0]);
}

modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
