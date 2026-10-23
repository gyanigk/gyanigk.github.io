"use strict";

document.getElementById("year").textContent = new Date().getFullYear();

const projectFilters = document.querySelector(".project-filters");
const projectCards = Array.from(document.querySelectorAll(".work-card"));
const projectCount = document.querySelector(".projects-count");
const filterButtons = Array.from(projectFilters.querySelectorAll("button"));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    let visibleCount = 0;

    projectCards.forEach((card) => {
      card.hidden = category !== "all" && card.dataset.category !== category;
      if (!card.hidden) visibleCount += 1;
    });

    filterButtons.forEach((filter) => {
      filter.setAttribute("aria-pressed", String(filter === button));
    });

    const labels = {
      all: "works",
      projects: "projects",
      research: "research works",
      talks: "talks & slide decks",
    };
    projectCount.textContent = `Showing ${visibleCount} ${labels[category]}`;
  });
});

projectFilters.hidden = false;

const projectNav = document.querySelector(".nav-header");
function updateProjectNav() {
  projectNav.classList.toggle("scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", updateProjectNav, { passive: true });
updateProjectNav();
