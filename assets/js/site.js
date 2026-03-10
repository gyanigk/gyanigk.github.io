"use strict";

function initMediaOptimization() {
  var images = Array.prototype.slice.call(document.querySelectorAll("img"));
  images.forEach(function (img, index) {
    if (!img.hasAttribute("decoding")) {
      img.decoding = "async";
    }

    // Keep the first few images eager for above-the-fold rendering.
    if (!img.hasAttribute("loading")) {
      img.loading = index < 3 ? "eager" : "lazy";
    }
  });

  var videos = Array.prototype.slice.call(document.querySelectorAll("video"));
  videos.forEach(function (video) {
    if (!video.hasAttribute("preload")) {
      video.preload = "metadata";
    }
  });
}

function initPaperCards() {
  var paperCards = Array.prototype.slice.call(document.querySelectorAll(".paper-card"));
  if (!paperCards.length) {
    return;
  }

  function toggleCard(card) {
    var isExpanded = card.classList.toggle("expanded");
    card.setAttribute("aria-expanded", String(isExpanded));
  }

  paperCards.forEach(function (card) {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", card.classList.contains("expanded") ? "true" : "false");

    card.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        return;
      }
      toggleCard(card);
    });

    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCard(card);
      }
    });
  });

}

function initJourneyCollage() {
  var container = document.getElementById("collage-container");
  if (!container) {
    return;
  }

  var images = [
    "images/journey/1695374187821%20(1).jpg",
    "images/journey/1695374188303.jpg",
    "images/journey/1695374189001.jpg",
    "images/journey/1696130072535.jpg",
    "images/journey/1696130073617.jpg",
    "images/journey/hike.jpeg",
    "images/journey/Middle-school-visit.jpeg",
    "images/journey/Playing%20guitar.jpeg",
    "images/journey/sawyer%20setup.jpeg",
    "images/journey/working%20on%20the%20Go1.jpeg",
  ];

  function shuffleArray(array) {
    var shuffled = array.slice();
    for (var i = shuffled.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }

  var gridPositions = [
    { column: "1 / 4", row: "1" },
    { column: "4 / 7", row: "1" },
    { column: "7 / 11", row: "1" },
    { column: "1 / 4", row: "2" },
    { column: "4 / 7", row: "2" },
    { column: "7 / 11", row: "2" },
    { column: "1 / 4", row: "3" },
    { column: "4 / 7", row: "3" },
    { column: "7 / 9", row: "3" },
    { column: "9 / 11", row: "3" },
  ];

  container.innerHTML = "";
  var fragment = document.createDocumentFragment();
  var shuffledImages = shuffleArray(images);

  shuffledImages.forEach(function (imgSrc, index) {
    var pos = gridPositions[index];
    var div = document.createElement("div");
    div.style.gridColumn = pos.column;
    div.style.gridRow = pos.row;
    div.style.position = "relative";
    div.style.overflow = "hidden";
    div.style.backgroundColor = "#e8e8e8";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";

    var img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "journey moment " + String(index + 1);
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.display = "block";
    img.loading = "lazy";
    img.decoding = "async";

    div.appendChild(img);
    fragment.appendChild(div);
  });

  container.appendChild(fragment);
}

function initPhotoCarousel() {
  var container = document.querySelector(".photo-carousel");
  if (!container) {
    return;
  }

  var slides = Array.prototype.slice.call(container.querySelectorAll(".photo-slide"));
  var dots = Array.prototype.slice.call(container.querySelectorAll(".photo-dot"));
  var prevBtn = container.querySelector(".photo-prev");
  var nextBtn = container.querySelector(".photo-next");

  if (!slides.length || !dots.length || !prevBtn || !nextBtn) {
    return;
  }

  var current = 0;
  var timer = null;
  var intervalMs = 4000;
  var allowAutoplay = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateA11y(index) {
    dots.forEach(function (dot, dotIndex) {
      dot.setAttribute("aria-selected", dotIndex === index ? "true" : "false");
      dot.setAttribute("tabindex", dotIndex === index ? "0" : "-1");
    });
  }

  function show(index) {
    var nextIndex = index;
    if (nextIndex < 0) {
      nextIndex = slides.length - 1;
    }
    if (nextIndex >= slides.length) {
      nextIndex = 0;
    }

    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = nextIndex;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    updateA11y(current);
  }

  function next() {
    show(current + 1);
  }

  function prev() {
    show(current - 1);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop();
    if (!allowAutoplay) {
      return;
    }
    timer = setInterval(next, intervalMs);
  }

  nextBtn.addEventListener("click", function () {
    next();
    start();
  });

  prevBtn.addEventListener("click", function () {
    prev();
    start();
  });

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      show(i);
      start();
    });
  });

  container.addEventListener("mouseenter", stop);
  container.addEventListener("mouseleave", start);
  container.addEventListener("focusin", stop);
  container.addEventListener("focusout", start);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  updateA11y(current);
  start();
}

document.addEventListener("DOMContentLoaded", function () {
  initMediaOptimization();
  initPaperCards();
  initJourneyCollage();
  initPhotoCarousel();
});
