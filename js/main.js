/* InstaBuilt — minimal interactions */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");

  /* Sticky nav state */
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  /* Close menu when a link is chosen */
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Scroll reveal */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach(function (el) { io.observe(el); });
})();

/* ---------- Events slideshow ---------- */
(function () {
  var scroller = document.getElementById("eventScroll");
  var prevBtn = document.getElementById("eventPrev");
  var nextBtn = document.getElementById("eventNext");
  if (!scroller || !prevBtn || !nextBtn) return;

  function step() {
    var card = scroller.querySelector(".event-card");
    if (!card) return 0;
    var gap = parseFloat(getComputedStyle(scroller).gap) || 22;
    return card.getBoundingClientRect().width + gap;
  }

  function updateArrows() {
    var max = scroller.scrollWidth - scroller.clientWidth - 2;
    prevBtn.disabled = scroller.scrollLeft <= 2;
    nextBtn.disabled = scroller.scrollLeft >= max;
  }

  prevBtn.addEventListener("click", function () {
    scroller.scrollBy({ left: -step(), behavior: "smooth" });
  });
  nextBtn.addEventListener("click", function () {
    scroller.scrollBy({ left: step(), behavior: "smooth" });
  });
  scroller.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();
})();

/* ---------- Customer support chat ---------- */
(function () {
  var btn = document.getElementById("chatBtn");
  var panel = document.getElementById("chatPanel");
  var closeBtn = document.getElementById("chatClose");
  var body = document.getElementById("chatBody");
  var form = document.getElementById("chatForm");
  var input = document.getElementById("chatInput");
  var quick = document.getElementById("chatQuick");
  if (!btn || !panel || !body) return;

  var greeted = false;
  var typingEl = null;

  function setOpen(open) {
    panel.classList.toggle("open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      if (!greeted) {
        greeted = true;
        addMsg("bot", "Hi! Welcome to InstaBuilt customer support. Ask me about Pop-Up sizes, build times, sustainability, or becoming a partner.");
      }
      if (input) input.focus();
    }
  }

  function addMsg(who, text) {
    var d = document.createElement("div");
    d.className = "msg " + who;
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }

  function showTyping() {
    typingEl = addMsg("bot", "…");
    typingEl.classList.add("typing");
  }

  function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  function reply(inputText) {
    var q = inputText.toLowerCase();
    if (/(pop-?up|size|price|cost|m²|m2|sqm|how much)/.test(q))
      return "Our Pop-Up homes come in three sizes — 28 m², 52 m² and 104 m². You can reserve one at instabuilt.com/order-your-popup/ or request an offer at instabuilt.com/get-your-offer.";
    if (/(fast|quick|how long|time|75|speed|days)/.test(q))
      return "Very fast. Modular construction cuts build time by up to 75% — components are factory-made, so most homes assemble on site in days, not months.";
    if (/(waste|green|sustain|eco|environment|kfw|recycl)/.test(q))
      return "Sustainability is the core of InstaBuilt: offsite construction removes waste before it exists, and we build to the KfW40 standard with 100% eco, bio & green materials.";
    if (/(partner|franchise|land|invest|develop|license)/.test(q))
      return "We partner across the EU and U.S. — Germany, Switzerland, Austria, Benelux and Texas. Landowners can become developers overnight: your land, our production. See the About Us page or start at instabuilt.com/get-your-offer.";
    if (/(human|person|contact|call|email|talk|real|agent)/.test(q))
      return "The fastest way to reach our team is instabuilt.com/get-your-offer — or visit instabuilt.com to schedule a meeting.";
    if (/(hello|hi|hey|help|what can you)/.test(q))
      return "Hello! I can help with Pop-Up sizes, build times, sustainability and partnerships. Pick a quick question below or type your own.";
    return "Good question! I can help with Pop-Up sizes (28 / 52 / 104 m²), build times (up to 75% faster), sustainability, and partnerships. For anything else, our team is one click away at instabuilt.com/get-your-offer.";
  }

  function ask(text) {
    addMsg("user", text);
    showTyping();
    setTimeout(function () {
      hideTyping();
      addMsg("bot", reply(text));
    }, 600 + Math.random() * 400);
  }

  btn.addEventListener("click", function () {
    setOpen(!panel.classList.contains("open"));
  });
  closeBtn.addEventListener("click", function () {
    setOpen(false);
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    input.value = "";
    ask(v);
  });
  quick.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) ask(b.textContent);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();
