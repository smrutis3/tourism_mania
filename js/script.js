const nav = document.querySelector(".navbar");
const navLinks = document.querySelector(".nav-links");
const menuBtn = document.querySelector(".menu-btn");
const backToTop = document.getElementById("upbtn");
const chatPanel = document.getElementById("chat-panel");
const chatOpen = document.getElementById("chat-open");
const chatOpenContact = document.getElementById("chat-open-contact");
const chatClose = document.getElementById("chat-close");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const sectionIds = ["home", "events", "explore", "tours", "about", "contact"];

function closeMenu() {
    navLinks.classList.remove("is-open");
    menuBtn.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
}

function toggleMenu() {
    const isOpen = navLinks.classList.toggle("is-open");
    menuBtn.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

function updateNav() {
    const offset = (nav ? nav.offsetHeight : 72) + 24;
    let current = "home";

    sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        if (section.getBoundingClientRect().top - offset <= 0) {
            current = id;
        }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
}

function onScroll() {
    if (window.scrollY > 240) {
        backToTop.classList.add("is-visible");
    } else {
        backToTop.classList.remove("is-visible");
    }
    updateNav();
}

function openChat() {
    chatPanel.hidden = false;
    chatOpen.setAttribute("aria-expanded", "true");
    closeMenu();
    window.setTimeout(() => chatInput.focus(), 50);
}

function closeChat() {
    chatPanel.hidden = true;
    chatOpen.setAttribute("aria-expanded", "false");
}

function toggleChat() {
    if (chatPanel.hidden) {
        openChat();
    } else {
        closeChat();
    }
}

function addBubble(text, from) {
    const bubble = document.createElement("p");
    bubble.className = `chat-bubble chat-bubble--${from}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function officialReply(message) {
    const text = message.toLowerCase();
    let reply =
        "I can help with upcoming events, 2026 tours, or reaching the desk. What would you like to know?";

    if (/(hello|hi|hey)\b/.test(text)) {
        reply =
            "Hello. I’m Amara with Tourismania. Tell me if you’re looking at a trek, a walk, or a coastal trip.";
    } else if (/event|everest|walk|andaman|trek/.test(text)) {
        reply =
            "Our upcoming events are the Everest camp trek, walking holidays, and Andaman Beaches. I can help you choose one.";
    } else if (/tour|itinerary|date|2026/.test(text)) {
        reply =
            "Upcoming tours for 2026: Port of Spain on 28 Jan, Gasparee Caves on 14 Mar, and the Trinidad North Coast on 5 May.";
    } else if (/email|contact|mail|reach|touch/.test(text)) {
        reply =
            "You can write to us at tourismania@gmail.com, or keep chatting here and I’ll assist.";
    } else if (/book|price|cost|plan|journey/.test(text)) {
        reply =
            "Share the trip you have in mind and your travel month. You can also use the contact form and I’ll follow up.";
    }

    window.setTimeout(() => addBubble(reply, "official"), 450);
}

function sendChat(message) {
    const value = message.trim();
    if (!value) return;
    addBubble(value, "guest");
    chatInput.value = "";
    officialReply(value);
}

menuBtn.addEventListener("click", toggleMenu);

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

chatOpen.addEventListener("click", toggleChat);
chatOpenContact.addEventListener("click", openChat);
chatClose.addEventListener("click", closeChat);

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendChat(chatInput.value);
});

document.querySelectorAll("[data-chat-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
        sendChat(button.getAttribute("data-chat-prompt"));
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !chatPanel.hidden) {
        closeChat();
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) closeMenu();
});

updateNav();
