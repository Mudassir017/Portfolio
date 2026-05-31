const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeToggleMobile = document.getElementById("themeToggleMobile");

function setTheme(theme) {
  html.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

function toggleTheme() {
  const current = html.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
}

themeToggle.addEventListener("click", toggleTheme);
themeToggleMobile.addEventListener("click", toggleTheme);

/* ─── Mobile Nav ─── */
const hamburger = document.getElementById("navHamburger");
const overlay = document.getElementById("navOverlay");
const overlayLinks = document.querySelectorAll(".overlay-link");
const mobileToggle = document.getElementById("themeToggleMobile");

function handleResize() {
  if (window.innerWidth <= 768) {
    mobileToggle.style.display = "flex";
  } else {
    mobileToggle.style.display = "none";
    overlay.classList.remove("open");
    hamburger.classList.remove("active");
    document.body.style.overflow = "";
  }
}
handleResize();
window.addEventListener("resize", handleResize);

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  overlay.classList.toggle("open");
  document.body.style.overflow = overlay.classList.contains("open")
    ? "hidden"
    : "";
});

overlayLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* ─── Navbar Scroll State ─── */
const navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  },
  { passive: true },
);

/* ─── Active Nav Link ─── */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + id) {
          link.classList.add("active");
        }
      });
    }
  });
}
window.addEventListener("scroll", updateActiveLink, { passive: true });

/* ─── Scroll Reveal ─── */
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px",
  },
);
revealElements.forEach((el) => revealObserver.observe(el));

/* ─── Counter Animation ─── */
const statNumbers = document.querySelectorAll(".stat-number[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute("data-count"));
        let count = 0;
        const duration = 1200;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          entry.target.textContent = count + (target > 1 ? "+" : "");
          if (target === 1) entry.target.textContent = count;
        }, 16);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);
statNumbers.forEach((el) => counterObserver.observe(el));

/* ─── Cursor Glow ─── */
const glow = document.getElementById("cursorGlow");
let mouseX = 0,
  mouseY = 0,
  glowX = 0,
  glowY = 0;

document.addEventListener(
  "mousemove",
  (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  },
  { passive: true },
);

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  glow.style.left = glowX + "px";
  glow.style.top = glowY + "px";
  requestAnimationFrame(animateGlow);
}
animateGlow();

/* ─── Profile Photo 3D Tilt Effect ─── */
const ring = document.querySelector(".hero-image-ring");
if (ring) {
  ring.addEventListener("mousemove", (e) => {
    const rect = ring.getBoundingClientRect();
    // Get mouse coordinates relative to the element center
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    // Rotate around Y based on X offset, and around X based on Y offset (negated for natural feel)
    ring.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  ring.addEventListener("mouseenter", () => {
    ring.style.transition = "none";
  });

  ring.addEventListener("mouseleave", () => {
    ring.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    ring.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

/* ─── Footer Text Hover Effect ─── */
const footerSvg = document.getElementById("footerSvg");
const revealMask = document.getElementById("revealMask");
if (footerSvg && revealMask) {
  let isHovered = false;

  footerSvg.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  footerSvg.addEventListener("mouseleave", () => {
    isHovered = false;
    // Gracefully snap the radial gradient mask to the center when mouse leaves
    revealMask.setAttribute("cx", "50%");
    revealMask.setAttribute("cy", "50%");
  });

  footerSvg.addEventListener("mousemove", (e) => {
    if (!isHovered) return;
    const rect = footerSvg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    revealMask.setAttribute("cx", `${x}%`);
    revealMask.setAttribute("cy", `${y}%`);
  });
}

/* ─── Smooth scroll for all anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
