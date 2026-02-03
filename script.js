// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navLinksItems = document.querySelectorAll(".nav-links li");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("nav-active");
  hamburger.classList.toggle("toggle");
});

// Close mobile menu when a link is clicked
navLinksItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (navLinks.classList.contains("nav-active")) {
      navLinks.classList.remove("nav-active");
      hamburger.classList.remove("toggle");
    }
  });
});

// Navbar Scroll Effect
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Scroll Animations (Intersection Observer)
const observerOptions = {
  threshold: 0.2, // Trigger when 20% of the element is visible
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

// Target elements for animation
const sections = document.querySelectorAll(".section");
const cards = document.querySelectorAll(
  ".project-card, .stat-card, .skill-category",
);

sections.forEach((section) => {
  section.classList.add("hidden-section");
  observer.observe(section);
});

cards.forEach((card, index) => {
  card.classList.add("hidden-card");
  // Add staggered delay via inline style or handling in observer loop
  card.style.transitionDelay = `${index * 100}ms`;
  observer.observe(card);
});

// Glitch effect enhancement (Optional: Randomize glitch on hover)
const glitchText = document.querySelector(".glitch-text");
if (glitchText) {
  glitchText.addEventListener("mouseover", () => {
    glitchText.style.animation = "none";
    void glitchText.offsetWidth; // trigger reflow
    glitchText.style.animation =
      "glitch 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite";
  });

  glitchText.addEventListener("mouseout", () => {
    glitchText.style.animation = "fadeUp 0.8s forwards";
  });
}
