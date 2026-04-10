/* ========================= LOADER ========================= */
window.onload = () => {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
};

/* ========================= SERVICE SELECTION ========================= */
function selectService(service) {
    localStorage.setItem("selectedService", service);
    window.location.href = "rendezvous.html";
}

/* ========================= RESERVATION SYSTEM ========================= */
const form = document.getElementById("form");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let rdv = JSON.parse(localStorage.getItem("rdv")) || [];
        let blocked = JSON.parse(localStorage.getItem("blocked")) || [];

        let nom = document.getElementById("nom").value;
        let email = document.getElementById("email").value;
        let tel = document.getElementById("tel").value;
        let adresse = document.getElementById("adresse").value;
        let prestation = document.getElementById("prestation").value;
        let date = document.getElementById("date").value;
        let heure = document.getElementById("heure").value;

        /* DATE BLOQUÉE */
        if (blocked.includes(date)) {
            return showMessage("❌ Cette date est bloquée");
        }

        /* MAX 2 RDV PAR JOUR */
        let sameDay = rdv.filter(r => r.date === date);
        if (sameDay.length >= 2) {
            return showMessage("❌ Journée complète (max 2 RDV)");
        }

        /* CONFLIT HORAIRE */
        let conflict = rdv.find(r => r.date === date && r.heure === heure);
        if (conflict) {
            return showMessage("❌ Créneau déjà pris");
        }

        /* AJOUT RDV */
        let newRdv = {
            nom,
            email,
            tel,
            adresse,
            prestation,
            date,
            heure
        };

        rdv.push(newRdv);
        localStorage.setItem("rdv", JSON.stringify(rdv));

        showMessage("✅ Réservation confirmée !");
        form.reset();
    });
}

/* ========================= MESSAGE ========================= */
function showMessage(msg) {
    const m = document.getElementById("message");
    if (m) m.innerText = msg;
}

/* ========================= ADMIN LOGIN ========================= */
function login() {
    const password = document.getElementById("password").value;

    if (password === "admin123") {
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("loginBox").style.display = "none";
        loadReservations();
    } else {
        alert("❌ Mot de passe incorrect");
    }
}

/* ========================= LOAD RESERVATIONS ========================= */
function loadReservations() {
    let rdv = JSON.parse(localStorage.getItem("rdv")) || [];
    let list = document.getElementById("list");

    list.innerHTML = "";

    rdv.forEach((r, i) => {
        list.innerHTML += `
        <div style="padding:10px;border:1px solid #333;margin:10px 0;">
            <b>${r.nom}</b> - ${r.prestation}<br>
            📅 ${r.date} à ${r.heure}<br>
            📞 ${r.tel}<br>
            📧 ${r.email}<br>
            <button onclick="deleteRdv(${i})">Supprimer</button>
        </div>
        `;
    });
}

/* ========================= DELETE RDV ========================= */
function deleteRdv(i) {
    let rdv = JSON.parse(localStorage.getItem("rdv")) || [];
    rdv.splice(i, 1);
    localStorage.setItem("rdv", JSON.stringify(rdv));
    loadReservations();
}

/* ========================= BLOCK DATE ========================= */
function blockDate() {
    let blocked = JSON.parse(localStorage.getItem("blocked")) || [];
    let date = document.getElementById("blockDate").value;

    if (!blocked.includes(date)) {
        blocked.push(date);
    }

    localStorage.setItem("blocked", JSON.stringify(blocked));
    alert("📌 Date bloquée");
}

/* ========================= BLOCK WEEK ========================= */
function blockWeek() {
    let blocked = JSON.parse(localStorage.getItem("blocked")) || [];
    let start = new Date(document.getElementById("weekDate").value);

    for (let i = 0; i < 7; i++) {
        let d = new Date(start);
        d.setDate(start.getDate() + i);

        let formatted = d.toISOString().split("T")[0];

        if (!blocked.includes(formatted)) {
            blocked.push(formatted);
        }
    }

    localStorage.setItem("blocked", JSON.stringify(blocked));
    alert("📅 Semaine bloquée");
}