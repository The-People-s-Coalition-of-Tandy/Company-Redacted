var carousel = document.querySelector(".carousel");
var cells = carousel.querySelectorAll(".carousel__cell");
var cellCount = 6;
var selectedIndex = 0;
var cellWidth = carousel.offsetWidth;
var cellHeight = carousel.offsetHeight;
var isHorizontal = window.innerWidth < 1000 ? true : true;
var rotateFn = isHorizontal ? "rotateY" : "rotateX";
var radius, theta;

var lazyLoaded = false;

function mod(n, m) {
  return ((n % m) + m) % m;
}

function rotateCarousel() {
  cells[Math.abs(mod(selectedIndex, cellCount))].classList.add("active");

  var angle = theta * selectedIndex * -1;
  carousel.style.transform =
    "translateZ(" + -radius + "px) " + rotateFn + "(" + angle + "deg)";
  carousel.style.webkitTransform =
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
      cell.style.webkitTransform =
        rotateFn + "(" + cellAngle + "deg) translateZ(" + radius + "px)";
    } else {
      // hidden cell
      cell.style.opacity = 0;
      cell.style.transform = "none";
      cell.style.webkitTransform = "none";
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
