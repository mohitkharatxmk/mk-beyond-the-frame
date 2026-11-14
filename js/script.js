
import gsap from "gsap";
import Lenis from "lenis";

/* =========================================
   ELEMENTS
========================================= */

const opening = document.querySelector("#opening");
const counter = document.querySelector("#counter");
const loadingProgress = document.querySelector("#loading-progress");
const batCover = document.querySelector("#bat-cover");
const batBackground = document.querySelector("#bat-background");
const cursorBat = document.querySelector("#cursor-bat");
const cursorGlow = document.querySelector(".cursor-glow");

/* =========================================
   BAT SVG
========================================= */

const batShape = `
<svg viewBox="0 0 120 60" aria-hidden="true">
  <path d="M60 27 C52 16 43 10 31 5 L37 22 C24 12 12 10 2 8 C8 20 11 31 22 39 C31 45 42 45 52 39 L60 55 L68 39 C78 45 89 45 98 39 C109 31 112 20 118 8 C108 10 96 12 83 22 L89 5 C77 10 68 16 60 27 Z"/>
</svg>
`;

function createBat(parent, className = "bat") {
  const bat = document.createElement("div");
  bat.className = className;
  bat.innerHTML = batShape;
  parent.appendChild(bat);
  return bat;
}

/* =========================================
   BACKGROUND BATS
========================================= */

function createBackgroundBats() {
  if (!batBackground) return;

  const amount = window.innerWidth < 700 ? 9 : 20;

  for (let i = 0; i < amount; i++) {
    const bat = createBat(batBackground, "background-bat");
    const size = gsap.utils.random(18, 55);

    bat.style.setProperty("--size", `${size}px`);

    gsap.set(bat, {
      x: gsap.utils.random(0, window.innerWidth),
      y: gsap.utils.random(0, window.innerHeight),
      rotation: gsap.utils.random(-25, 25),
      opacity: gsap.utils.random(0.08, 0.22)
    });

    gsap.to(bat, {
      x: `+=${gsap.utils.random(-100, 100)}`,
      y: `+=${gsap.utils.random(-80, 80)}`,
      rotation: gsap.utils.random(-35, 35),
      duration: gsap.utils.random(8, 17),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
}

/* =========================================
   ORIGINAL INTRO ANIMATION
   MK LOGO → COUNTER → BAT SWARM
   → BATS SCATTER → HERO
========================================= */

function runIntro() {
  if (!opening || !counter || !loadingProgress || !batCover) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    gsap.set(opening, { display: "none" });
    document.body.style.overflow = "";
    return;
  }

  document.body.style.overflow = "hidden";

  const bats = [];
  const isMobile = window.innerWidth < 700;
  const batCount = isMobile ? 65 : 125;

  for (let i = 0; i < batCount; i++) {
    const bat = createBat(batCover, "bat");

    const size = gsap.utils.random(
      isMobile ? 30 : 35,
      isMobile ? 75 : 100
    );

    bat.style.setProperty("--size", `${size}px`);

    const startX = gsap.utils.random(
      -window.innerWidth,
      window.innerWidth * 2
    );

    const startY = gsap.utils.random(
      -window.innerHeight,
      window.innerHeight * 2
    );

    gsap.set(bat, {
      x: startX,
      y: startY,
      rotation: gsap.utils.random(-180, 180),
      scale: gsap.utils.random(0.5, 1.5),
      opacity: 0
    });

    bats.push(bat);
  }

  gsap.set(".opening-logo", {
    opacity: 0,
    scale: 0.75,
    y: 25
  });

  gsap.set(".loading-counter", {
    opacity: 0,
    y: 15
  });

  gsap.set(".loading-line", { opacity: 0 });
  gsap.set(".loading-label", { opacity: 0 });

  gsap.set(".profile-reveal", {
    opacity: 0,
    visibility: "hidden"
  });

  const intro = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      document.body.style.overflow = "";
      opening.style.display = "none";
      opening.setAttribute("aria-hidden", "true");
    }
  });

  intro.to(".opening-logo", {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 1.2
  });

  intro.to(".loading-counter", {
    opacity: 1,
    y: 0,
    duration: 0.45
  }, "-=0.25");

  intro.to(".loading-line", {
    opacity: 1,
    duration: 0.35
  }, "<");

  intro.to(".loading-label", {
    opacity: 1,
    duration: 0.35
  }, "<");

  intro.to({ value: 0 }, {
    value: 100,
    duration: 2.5,
    ease: "power1.inOut",
    onUpdate: function () {
      const value = Math.round(this.targets()[0].value);

      counter.textContent = String(value).padStart(2, "0");

      gsap.set(loadingProgress, {
        width: `${value}%`
      });
    }
  });

  intro.addLabel("swarm");

  bats.forEach((bat, index) => {
    const targetX = gsap.utils.random(-60, window.innerWidth - 40);
    const targetY = gsap.utils.random(-60, window.innerHeight - 40);

    gsap.to(bat, {
      x: targetX,
      y: targetY,
      rotation: gsap.utils.random(-50, 50),
      scale: gsap.utils.random(0.8, 1.5),
      opacity: gsap.utils.random(0.85, 1),
      duration: gsap.utils.random(0.8, 1.5),
      ease: "power2.in",
      delay: index * 0.003
    });
  });

  intro.to(
    ".opening-logo, .loading-counter, .loading-line, .loading-label",
    {
      opacity: 0,
      duration: 0.35,
      stagger: 0.04
    },
    "swarm+=0.7"
  );

  intro.to({}, { duration: 0.65 });

  bats.forEach((bat, index) => {
    const direction = Math.random() > 0.5 ? 1 : -1;

    gsap.to(bat, {
      x: direction * (window.innerWidth + 300),
      y: gsap.utils.random(
        -window.innerHeight,
        window.innerHeight * 1.5
      ),
      rotation: gsap.utils.random(-240, 240),
      scale: gsap.utils.random(0.4, 1.4),
      opacity: 0,
      duration: gsap.utils.random(0.8, 1.35),
      delay: index * 0.004,
      ease: "power3.in"
    });
  });

  intro.to(opening, {
    opacity: 0,
    duration: 0.85,
    ease: "power2.inOut"
  }, "-=0.55");

  intro.set(opening, { display: "none" });

  intro.call(() => {
    document.body.style.overflow = "";
  });
}

/* =========================================
   CURSOR BAT + RED SPOTLIGHT
========================================= */

function initCursorEffects() {
  if (!cursorBat || !cursorGlow) return;

  if (window.matchMedia("(pointer: coarse)").matches) {
    cursorBat.style.display = "none";
    cursorGlow.style.display = "none";
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let batX = mouseX;
  let batY = mouseY;

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    gsap.to(cursorGlow, {
      x: mouseX,
      y: mouseY,
      duration: 0.45,
      ease: "power2.out"
    });

    gsap.to(cursorBat, {
      opacity: 1,
      duration: 0.25
    });
  });

  function animateCursorBat() {
    batX += (mouseX - batX) * 0.13;
    batY += (mouseY - batY) * 0.13;

    const rotation = mouseX > batX ? 8 : -8;

    gsap.set(cursorBat, {
      x: batX - 20,
      y: batY - 12,
      rotation
    });

    requestAnimationFrame(animateCursorBat);
  }

  animateCursorBat();

  window.addEventListener("pointerleave", () => {
    gsap.to(cursorBat, {
      opacity: 0,
      duration: 0.25
    });
  });
}

/* =========================================
   SECTION REVEALS
========================================= */

function initSectionReveals() {
  const elements = document.querySelectorAll(`
    .section-heading,
    .section h2,
    .section-intro,
    .skill-shelf,
    .project-poster,
    .timeline-item,
    .cert-frame,
    .resume-download,
    .contact .email-link
  `);

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out"
        });

        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  elements.forEach((element) => {
    gsap.set(element, {
      opacity: 0,
      y: 35
    });

    observer.observe(element);
  });
}

/* =========================================
   PROJECT DETAILS
========================================= */

const projectData = {
  nexpath: {
    kicker: "FULL STACK WEB APPLICATION",
    title: "NEXPATH",
    description:
      "A career and community platform designed to bring students, alumni and opportunities together through one digital experience.",

    features: [
      "Authentication and user dashboards",
      "Community forums and events",
      "Tests, jobs and alumni modules",
      "React frontend connected to Spring Boot microservices",
      "REST APIs and API Gateway integration"
    ],

    technologies: [
      "Java",
      "Spring Boot",
      "Microservices",
      "React",
      "MySQL",
      "JWT"
    ],

    collaboration: "Collaborative CDAC project",

    liveUrl: "https://nexpath-frontend.onrender.com/",

    sourceUrl: "https://github.com/mohitkharatxmk/NexPath"
  },

  lifehub: {
    kicker: "PRODUCTIVITY · FITNESS · AI",
    title: "LIFE HUB",
    description:
      "A productivity and fitness platform bringing everyday wellness and personal progress into one place.",

    features: [
      "Calorie tracking",
      "Habit tracking",
      "Workout tracking",
      "Personal progress overview",
      "AI-powered recipe recommendations"
    ],

    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "AI Integration"
    ],

    collaboration: "",
    liveUrl: "",
    sourceUrl: ""
  }
};

function initProjectModal() {
  const modal = document.querySelector("#project-modal");
  const modalTitle = document.querySelector("#modal-title");
  const modalKicker = document.querySelector("#modal-kicker");
  const modalDescription = document.querySelector("#modal-description");
  const modalFeatures = document.querySelector("#modal-features");
  const modalTags = document.querySelector("#modal-tags");
  const modalNote = modal?.querySelector(".modal-note");

  if (!modal) return;

  const openModal = (projectKey) => {
    const project = projectData[projectKey];

    if (!project) return;

    modalTitle.textContent = project.title;
    modalKicker.textContent = project.kicker;
    modalDescription.textContent = project.description;

    modalFeatures.replaceChildren();
    modalTags.replaceChildren();

    project.features.forEach((feature) => {
      const item = document.createElement("li");
      item.textContent = feature;
      modalFeatures.appendChild(item);
    });

    project.technologies.forEach((technology) => {
      const tag = document.createElement("span");
      tag.textContent = technology;
      modalTags.appendChild(tag);
    });

    if (modalNote) {
      modalNote.replaceChildren();

      if (project.collaboration) {
        const credit = document.createElement("span");
        credit.className = "modal-collaboration";
        credit.textContent = project.collaboration;
        modalNote.appendChild(credit);
      }

      const links = [
        {
          label: "LIVE DEMO ↗",
          url: project.liveUrl,
          className: "modal-project-link modal-project-link-primary"
        },
        {
          label: "GITHUB SOURCE ↗",
          url: project.sourceUrl,
          className: "modal-project-link"
        }
      ].filter((item) => item.url);

      if (links.length) {
        const linkGroup = document.createElement("div");
        linkGroup.className = "modal-project-links";

        links.forEach((item) => {
          const anchor = document.createElement("a");
          anchor.className = item.className;
          anchor.href = item.url;
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
          anchor.textContent = item.label;
          linkGroup.appendChild(anchor);
        });

        modalNote.appendChild(linkGroup);
      } else if (!project.collaboration) {
        modalNote.textContent = "Project links will be added soon.";
      }
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.project);
    });
  });

  modal.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

/* =========================================
   SECTION TRANSITION BAT
========================================= */

function initSectionTransitions() {
  const transitionBat = createBat(document.body, "section-transition-bat");

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (!target || targetId === "#") return;

      event.preventDefault();

      const destination =
        target.getBoundingClientRect().top + window.scrollY;

      gsap.killTweensOf(transitionBat);

      gsap.set(transitionBat, {
        x: -180,
        y: window.innerHeight * 0.35,
        opacity: 0,
        scale: 0.8
      });

      const transition = gsap.timeline();

      transition.to(transitionBat, {
        opacity: 1,
        x: window.innerWidth * 0.35,
        duration: 0.3,
        ease: "power2.out"
      });

      transition.to(transitionBat, {
        x: window.innerWidth + 180,
        y: window.innerHeight * 0.15,
        opacity: 0,
        rotation: 20,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          window.scrollTo({
            top: destination,
            behavior: "smooth"
          });
        }
      });
    });
  });
}

/* =========================================
   LENIS SMOOTH SCROLL
========================================= */

function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

/* =========================================
   INITIALIZE EVERYTHING
========================================= */

function initializePortfolio() {
  createBackgroundBats();
  initCursorEffects();
  initSectionReveals();
  initProjectModal();
  initSectionTransitions();
  initSmoothScroll();
  runIntro();
}

initializePortfolio();
