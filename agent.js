/* === POPUP HISTORIE === */
const stories = [
    "Stary, na Ostatnim Groszu mówią, że pierwsza kapibara pojawiła się po burzy w 1998, jak kable jeszcze zwisały nad blokami.",
    "Heniek z garaży przysięga, że widział mnie, jak przechodziłem przez pasy jak prezydent dzielnicy.",
    "Mówią, że pilnuję osiedlowych neonów i pojawiam się tam, gdzie ktoś kombinuje za bardzo.",
    "Dzieciaki twierdzą, że znam wszystkie skróty między blokami i znikam szybciej niż 46 z przystanku."
];

document.getElementById("capy").onclick = () => {
    document.getElementById("popup").style.display = "block";
    document.getElementById("story").innerText =
        stories[Math.floor(Math.random() * stories.length)];

    document.getElementById("kapibaraChat").style.display = "flex";
};

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

/* === GRAFFITI === */
const graffitiWords = ["ŻABKA3", "OSIEDLE110", "GROSZ CREW", "RKS", "MK", "LGC", "46", "KONTAKT"];
function spawnGraffiti() {
    const g = document.createElement("div");
    g.className = "graffiti";
    g.innerText = graffitiWords[Math.floor(Math.random() * graffitiWords.length)];

    g.style.left = (20 + Math.random() * 60) + "%";
    g.style.top = (50 + Math.random() * 20) + "%";

    document.body.appendChild(g);
    setTimeout(() => g.remove(), 8000);
}
setInterval(spawnGraffiti, 5000);

/* === ŻYROSKOP === */
window.addEventListener("deviceorientation", (e) => {
    const x = e.gamma;
    const y = e.beta;
    document.getElementById("scene").style.transform =
        `translate(${x * 0.8}px, ${y * 0.4}px) scale(1.05)`;
});

/* === CZAT KAPIBARY === */
const kapibaraChat = document.getElementById("kapibaraChat");
const kapibaraChatWindow = document.getElementById("kapibaraChatWindow");
const kapibaraInput = document.getElementById("kapibaraInput");
const kapibaraSend = document.getElementById("kapibaraSend");
const closeChat = document.getElementById("closeChat");

const kapibaraLegends = [
    "Siema, ja tu siedzę od lat. Beton pamięta więcej niż ludzie.",
    "Jak 46 jeździła częściej, potrafiłem przebiec obok torów i nikt nawet nie ogarnął, że to ja.",
    "Garaże za blokiem? Tam się dzieją rzeczy, o których Heniek nie gada nawet po trzecim piwie.",
    "Mur z napisem 'Start Osiedle Misja Kontakt'? To nie jest zwykłe graffiti, to instrukcja dla wtajemniczonych.",
    "Każdy balkon na Ostatnim Groszu ma swoją historię. Ja znam większość."
];

/* === helper === */
function kapibaraAddMsg(text, sender="bot") {
    const div = document.createElement("div");
    div.className = `msg ${sender}`;
    div.innerText = text;
    kapibaraChatWindow.appendChild(div);
    kapibaraChatWindow.scrollTop = kapibaraChatWindow.scrollHeight;
}

/* === Wikipedia fetch === */
async function fetchWikiSummary(query) {
    try {
        const url =
          "https://pl.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&titles=" +
          encodeURIComponent(query);

        const res = await fetch(url);
        const data = await res.json();
        const pages = data.query && data.query.pages;
        const page = pages && Object.values(pages)[0];
        if (page && page.extract) return page.extract;
        return null;
    } catch {
        return null;
    }
}

/* === AI kapibary === */
async function kapibaraAI(msg) {
    const m = msg.toLowerCase();

    if (m.includes("kim") || m.includes("kto") || m.includes("jesteś"))
        return "Jestem kapibara z Ostatniego Grosza, mordo. Osiedle samo mnie wybrało.";

    if (m.includes("ostatni grosz") || m.includes("osiedle")) {
        const wiki = await fetchWikiSummary("Ostatni Grosz (Częstochowa)");
        if (wiki)
            return "Dobra, oficjalnie mówią tak:\n\n" + wiki + "\n\nA nieoficjalnie — to nasze osiedle, gdzie każdy zna każdy murek.";
        return "Ostatni Grosz to labirynt bloków, garaży i skrótów. Jak nie jesteś stąd, to się zgubisz po minucie.";
    }

    if (m.includes("częstochowa")) {
        const wiki = await fetchWikiSummary("Częstochowa");
        if (wiki)
            return "Oficjalnie o mieście mówią tak:\n\n" + wiki + "\n\nA ja ci powiem tyle: Grosz to serce, reszta to tło.";
        return "Częstochowa to miasto, gdzie stoi Jasna Góra, ale ja siedzę raczej przy garażach niż przy klasztorze.";
    }

    if (m.includes("blok") || m.includes("balkon") || m.includes("klatka"))
        return "Bloki tutaj mają duszę. Każda klatka pachnie inaczej, a z każdego balkonu kiedyś coś spadło.";

    if (m.includes("legend") || m.includes("histori") || m.includes("opowiedz"))
        return kapibaraLegends[Math.floor(Math.random() * kapibaraLegends.length)];

    if (m.includes("kapibara"))
        return "Tak, to ja. Najbardziej osiedlowa kapibara w Częstochowie.";

    return "Nie wszystko mogę mówić na głos, wiesz jak jest. Zapytaj o Grosz, bloki albo legendy.";
}

/* === wysyłanie === */
kapibaraSend.onclick = async () => {
    const text = kapibaraInput.value.trim();
    if (!text) return;

    kapibaraAddMsg(text, "user");
    kapibaraInput.value = "";

    const reply = await kapibaraAI(text);
    kapibaraAddMsg(reply, "bot");
};

kapibaraInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        kapibaraSend.click();
    }
});

closeChat.onclick = () => kapibaraChat.style.display = "none";