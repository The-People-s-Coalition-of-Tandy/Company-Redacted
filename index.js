var carousel = document.querySelector(".carousel");
var cells = carousel.querySelectorAll(".carousel__cell");
var cellCount = 6;
var selectedIndex = 0;
var cellWidth = carousel.offsetWidth;
var cellHeight = carousel.offsetHeight;
var isHorizontal = window.innerWidth < 1000 ? true : true;
var rotateFn = isHorizontal ? "rotateY" : "rotateX";
var radius, theta;
const imageModal = document.querySelector("#image-modal");
const gallery = document.querySelectorAll("#photos__gallery img");
var img = document.querySelector("#modal-image");
var lazyLoaded = false;

function mod(n, m) {
  return ((n % m) + m) % m;
}

function rotateCarousel() {
  cells[Math.abs(mod(selectedIndex, cellCount))].classList.add("active");

  var angle = theta * selectedIndex * -1;
  carousel.style.transform =
    "translateZ(" + -radius + "px) " + rotateFn + "(" + angle + "deg)";
}

var prevButton = document.querySelector(".previous-button");
prevButton.addEventListener("click", function () {
  selectedIndex--;
  cells[Math.abs(mod(selectedIndex + 1, cellCount))].classList.remove("active");
  rotateCarousel();
  !lazyLoaded && lazyLoad();
});

var nextButton = document.querySelector(".next-button");
nextButton.addEventListener("click", function () {
  selectedIndex++;
  cells[Math.abs(mod(selectedIndex - 1, cellCount))].classList.remove("active");
  rotateCarousel();
  !lazyLoaded && lazyLoad();
});

function changeCarousel() {
  theta = 360 / cellCount;
  var cellSize = isHorizontal ? cellWidth : cellHeight;
  radius = Math.round(cellSize / 2 / Math.tan(Math.PI / cellCount));
  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    if (i < cellCount) {
      // visible cell
      cell.style.opacity = 1;
      var cellAngle = theta * i;
      cell.style.transform =
        rotateFn + "(" + cellAngle + "deg) translateZ(" + radius + "px)";
    } else {
      // hidden cell
      cell.style.opacity = 0;
      cell.style.transform = "none";
    }
  }

  rotateCarousel();
}

var orientationRadios = document.querySelectorAll('input[name="orientation"]');
(function () {
  for (var i = 0; i < orientationRadios.length; i++) {
    var radio = orientationRadios[i];
    radio.addEventListener("change", onOrientationChange);
  }
})();

function onOrientationChange() {
  rotateFn = isHorizontal ? "rotateY" : "rotateX";
  changeCarousel();
}

function goToPanelFromHome(panelNum) {
  selectedIndex += panelNum;
  rotateCarousel();
}

function goHome() {
  selectedIndex = 0;
  rotateCarousel();
}

const navButtons = document.getElementsByClassName("nav-button");

for (let i = 0; i < navButtons.length; i++) {
  navButtons[i].addEventListener(
    "click",
    goToPanelFromHome.bind(this, navButtons[i].value)
  );
}

// set initials
onOrientationChange();

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

// const handleMouseWheel = debounce((ev) => {
//   selectedIndex++;
//   rotateCarousel();
// }, 50);
// window.addEventListener("wheel", handleMouseWheel);

const video = document.getElementById("works__background-video");
const source = document.getElementById("works__background-source");

function setWorksBackground(file) {
  source.src = file;
  video.pause();
  video.load();
  video.play();
  video.classList.add("visible");
}

function removeWorksBackground() {
  video.pause();
  source.src = "";
  video.load();
  video.classList.remove("visible");
}

const works = document.getElementsByClassName("works__link");

for (let i = 0; i < works.length; i++) {
  works[i].addEventListener(
    "mouseover",
    setWorksBackground.bind(this, works[i].dataset.videosnippet)
  );
  works[i].addEventListener("mouseleave", removeWorksBackground);
}

// document.addEventListener("touchstart", handleTouchStart, false);
// document.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      selectedIndex++;
      rotateCarousel();
      !lazyLoaded && lazyLoad();
    } else {
      selectedIndex--;
      rotateCarousel();
      !lazyLoaded && lazyLoad();
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

for (let i = 0; i < gallery.length; i++) {
  gallery[i].addEventListener("click", () => {
    handleImageClick(gallery[i].dataset.src);
  });
}

function lazyLoad() {
  lazyLoaded = true;
  for (let i = 0; i < gallery.length; i++) {
    gallery[i].src = gallery[i].dataset.src;
  }
}

function handleImageClick(photo) {
  imageModal.classList.add("show");
  img.src = photo;
}

function closeModal() {
  imageModal.classList.remove("show");
}
