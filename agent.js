/* === HISTORIE LGC === */
const stories = [
    "LGC powstało jak kable zwisały nad blokami w 98. Kapibara wybrała mnie.",
    "Heniek z garaży mówi że LGC to nie crew, to rodzina. Kapibara potwierdza.",
    "Widzisz ten mural 'Start Osiedle Misja Kontakt'? To my go pilnowaliśmy całą noc.",
    "46 jeździ rzadko, ale kapibara zawsze zdąży. Mamy swoje skróty między blokami.",
    "Żabka na dole? Płacimy groszem, bo to Ostatni Grosz. Kapibara ma zniżkę stałego klienta."
];

const kapibaraLegends = [
    "LGC to nie czapka, to stan umysłu. Kapibara wie.",
    "Jak widzisz mnie z kapibarą, to wiedz że Grosz jest bezpieczny tej nocy.",
    "Garaże, balkony, dachy - wszędzie mamy oczy. Kapibara ma najlepsze.",
    "Start, Misja, Kontakt - trzy słowa, jedna dzielnica. LGC.",
    "Złoty łańcuch? To nie szpan, to odznaczenie od osiedla za 25 lat służby."
];

/* === KLIK KAPIBARY - FIX === */
document.getElementById("capy").onclick = () => {
    // 1. Otwórz czat
    document.getElementById("kapibaraChat").style.display = "flex";
    
    // 2. Wrzuć losową historię do czatu jako pierwszą wiadomość
    const losowaHistoria = stories[Math.floor(Math.random() * stories.length)];
    kapibaraAddMsg("Ej, zanim zapytasz... " + losowaHistoria, "bot");
};

document.getElementById("btn-misje").onclick = () => {
    document.getElementById("popup").style.display = "block";
    document.getElementById("story").innerText =
        stories[Math.floor(Math.random() * stories.length)];
};

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

/* === GRAFFITI - FIX LIMIT === */
const graffitiWords = ["ŻABKA", "LGC", "GROSZ CREW", "RKS", "MK", "46", "KONTAKT", "START"];
function spawnGraffiti() {
    if (document.querySelectorAll('.graffiti').length >= 4) return;

    const g = document.createElement("div");
    g.className = "graffiti";
    g.innerText = graffitiWords[Math.floor(Math.random() * graffitiWords.length)];
    g.style.left = (20 + Math.random() * 60) + "%";
    g.style.top = (50 + Math.random() * 20) + "%";
    document.body.appendChild(g);
    setTimeout(() => g.remove(), 8000);
}
setInterval(spawnGraffiti, 6000);

/* === PARALLAX - FIX DESKTOP + MOBILE === */
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    document.getElementById("scene").style.transform =
        `translate(${x}px, ${y}px) scale(1.05)`;
});

window.addEventListener("deviceorientation", (e) => {
    if (!e.gamma ||!e.beta) return;
    const x = e.gamma * 0.8;
    const y = e.beta * 0.4;
    document.getElementById("scene").style.transform =
        `translate(${x}px, ${y}px) scale(1.05)`;
});

/* === CZAT KAPIBARY === */
const kapibaraChat = document.getElementById("kapibaraChat");
const kapibaraChatWindow = document.getElementById("kapibaraChatWindow");
const kapibaraInput = document.getElementById("kapibaraInput");
const kapibaraSend = document.getElementById("kapibaraSend");
const closeChat = document.getElementById("closeChat");

function kapibaraAddMsg(text, sender="bot") {
    const div = document.createElement("div");
    div.className = `msg ${sender}`;
    div.innerText = text;
    kapibaraChatWindow.appendChild(div);
    kapibaraChatWindow.scrollTop = kapibaraChatWindow.scrollHeight;
}

async function fetchWikiSummary(query) {
    try {
        const url = "https://pl.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&titles=" + encodeURIComponent(query);
        const res = await fetch(url);
        const data = await res.json();
        const pages = data.query?.pages;
        const page = pages && Object.values(pages)[0];
        return page?.extract || null;
    } catch {
        return null;
    }
}

async function kapibaraAI(msg) {
    const m = msg.toLowerCase();

    if (m.includes("lgc") || m.includes("czapka"))
        return "LGC - Last Grosz Crew. Kapibara dołączyła pierwsza, ja drugi.";

    if (m.includes("kim") || m.includes("kto") || m.includes("jesteś"))
        return "Jestem z LGC, mordo. Kapibara to mój ziomek. Pilnujemy Grosza razem od lat.";

    if (m.includes("ostatni grosz") || m.includes("osiedle")) {
        kapibaraAddMsg("Sprawdzam w osiedlowych aktach...", "bot");
        const wiki = await fetchWikiSummary("Ostatni Grosz (Częstochowa)");
        if (wiki) return "Oficjalnie:\n\n" + wiki + "\n\nNieoficjalnie: nasze bloki, nasze zasady, nasza kapibara.";
        return "Ostatni Grosz to labirynt bloków i garaży. Jak nie jesteś stąd, to się zgubisz po minucie.";
    }

    if (m.includes("częstochowa")) {
        const wiki = await fetchWikiSummary("Częstochowa");
        if (wiki) return "Wiki mówi tak:\n\n" + wiki + "\n\nA ja ci powiem: Grosz to serce, reszta to dzielnice.";
        return "Częstochowa ma Jasną Górę. My mamy Ostatni Grosz. I kapibarę.";
    }

    if (m.includes("blok") || m.includes("balkon") || m.includes("klatka"))
        return "Bloki tutaj mają duszę. Każda klatka pachnie inaczej. Kapibara zna wszystkie zapachy.";

    if (m.includes("legend") || m.includes("histori") || m.includes("opowiedz"))
        return kapibaraLegends[Math.floor(Math.random() * kapibaraLegends.length)];

    if (m.includes("kapibara"))
        return "Tak, to ona. Najbardziej osiedlowa kapibara w Polsce. LGC certified.";

    if (m.includes("żabka"))
        return "Żabka na dole czynna 6-23. Kapibara ma tam konto. Płacimy groszem.";

    return "Nie wszystko mogę mówić na głos, wiesz jak jest. Zapytaj o LGC, Grosz, bloki albo legendy.";
}

/* === WYSYŁANIE === */
kapibaraSend.onclick = async () => {
    const text = kapibaraInput.value.trim();
    if (!text) return;

    kapibaraAddMsg(text, "user");
    kapibaraInput.value = "";

    const reply = await kapibaraAI(text);
    setTimeout(() => kapibaraAddMsg(reply, "bot"), 300);
};

kapibaraInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        kapibaraSend.click();
    }
});

closeChat.onclick = () => kapibaraChat.style.display = "none";

// MENU PLACEHOLDER
document.getElementById("btn-start").onclick = () => kapibaraAddMsg("Start - Wkrótce nowe misje na Groszu.", "bot");
document.getElementById("btn-mapa").onclick = () => kapibaraAddMsg("Mapa - Tylko wtajemniczeni znają wszystkie skróty.", "bot");
document.getElementById("btn-postacie").onclick = () => kapibaraAddMsg("Postacie - Heniek, LGC, Kapibara. Reszta to tło.", "bot");
document.getElementById("btn-kontakt").onclick = () => kapibaraAddMsg("Kontakt - LGC nie odbiera nieznanych numerów.", "bot");