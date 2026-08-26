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
        addMsg("bot", "Hi! Welcome to InstaBuilt customer support. Ask me about our homes, build times, sustainability, partnerships — or anything else about the company.");
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
    if (/(pop-?up|28 m|52 m|104 m|tiny house|container home)/.test(q))
      return "Our Pop-Up homes come in three sizes — 28 m², 52 m² and 104 m². They arrive factory-finished and assemble in days. You can reserve one at instabuilt.com/order-your-popup/.";
    if (/(price|cost|how much|budget|quote|offer|pricing)/.test(q))
      return "Pricing depends on the product, size and project. Pop-Ups come in three sizes (28 / 52 / 104 m²); multistory and signature projects are quoted individually. Request a free offer at instabuilt.com/get-your-offer and we'll come back with numbers.";
    if (/(fast|quick|how long|time|75|speed|days|deliver)/.test(q))
      return "Speed is our core advantage: modular construction cuts build time by up to 75% — components are factory-made, so most homes assemble on site in days, not months.";
    if (/(waste|green|sustain|eco|environment|kfw|recycl|climate)/.test(q))
      return "Sustainability is the core of InstaBuilt: offsite construction removes waste before it exists, and we build to the KfW40 standard with 100% eco, bio & green materials.";
    if (/(partner|franchise|land|invest|develop|license)/.test(q))
      return "We partner across the EU and U.S. — Germany, Switzerland, Austria, Benelux and Texas. Landowners can become developers overnight: your land, our production. See the About Us page or start at instabuilt.com/get-your-offer.";
    if (/(material|wood|wall|panel|insulat|fabricat|rohbau)/.test(q))
      return "We use precision-engineered panel systems — eco-friendly wooden walls, factory-built to KfW40 standards. Panels (structural Rohbau shells) and modules are both produced in our own factory, then assembled on site.";
    if (/(multistory|apartment|senior|micro|traditional|signature|what do you build|house|home|product)/.test(q))
      return "We build Pop-Up homes, multistory multifamily, senior housing, micro apartments, traditional homes and signature homes — plus panelized and modular systems for developers. Browse them all on the homepage!";
    if (/(event|expo|exhibition|davos|fair|where can i see|meet)/.test(q))
      return "We exhibit across Europe and the U.S. — EXPO REAL in Munich, House of Kosova in Davos, Berlin Blockchain Week, Crypto Valley in Zug, Blueprint Las Vegas and the Housing Innovation Summit. See the Events section on the homepage.";
    if (/(who|found|history|company|team|about|family|pllana|story)/.test(q))
      return "InstaBuilt was founded by Besnik Pllana under the Pllana Capital umbrella and remains family-led. Our 140,000 m² plot includes a factory and a 5,700 m² innovation center. Meet the team on the About Us page!";
    if (/(where|location|germany|switzerland|austria|texas|benelux|market|country)/.test(q))
      return "We operate in Germany, Switzerland, Austria, Benelux and the U.S. (Texas), partnering with permitted projects across the EU and U.S.";
    if (/(human|person|contact|call|email|talk|real|agent|phone)/.test(q))
      return "The fastest way to reach our team is instabuilt.com/get-your-offer — or visit instabuilt.com to schedule a meeting.";
    if (/(hello|hi|hey|help|what can you)/.test(q))
      return "Hello! I can help with our products, build times, sustainability, partnerships and markets. Pick a quick question below or type your own.";
    return "I can help with: our products (Pop-Ups, multistory, traditional and signature homes), build times, sustainability, partnerships and markets. Pick a quick question below, or our team is one click away at instabuilt.com/get-your-offer.";
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

/* ---------- Olive bubble cursor ---------- */
(function () {
  if (!window.matchMedia) return;
  if (window.matchMedia("(pointer: coarse)").matches) return; // touch: keep the native cursor
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var el = document.createElement("div");
  el.className = "cursor-bubble";
  document.body.appendChild(el);
  document.documentElement.classList.add("has-bubble");

  var mx = -100, my = -100, x = -100, y = -100, hover = false;

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX;
    my = e.clientY;
    el.style.opacity = "1";
  });
  document.addEventListener("mouseout", function (e) {
    if (!e.relatedTarget) el.style.opacity = "0";
  });
  document.addEventListener("mouseover", function (e) {
    hover = !!e.target.closest("a, button, input, textarea, .event-card, .project-card, [role='button']");
  });
  document.addEventListener("mouseout", function (e) {
    if (e.relatedTarget) hover = false;
  });

  function loop() {
    x += (mx - x) * 0.22;
    y += (my - y) * 0.22;
    el.style.transform = "translate(" + x + "px," + y + "px) scale(" + (hover ? 1.6 : 1) + ")";
    requestAnimationFrame(loop);
  }
  loop();
})();
