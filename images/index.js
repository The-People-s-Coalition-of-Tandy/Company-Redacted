var carousel = document.querySelector(".carousel");
var cells = carousel.querySelectorAll(".carousel__cell");
var cellCount = 5;
var selectedIndex = 0;
var cellWidth = carousel.offsetWidth;
var cellHeight = carousel.offsetHeight;
console.log(window.innerWidth);
var isHorizontal = window.innerWidth < 1000 ? false : true;
var rotateFn = isHorizontal ? "rotateY" : "rotateX";
console.log(rotateFn);
var radius, theta;

function rotateCarousel() {
  var angle = theta * selectedIndex * -1;
  carousel.style.transform =
    "translateZ(" + -radius + "px) " + rotateFn + "(" + angle + "deg)";
}

var prevButton = document.querySelector(".previous-button");
prevButton.addEventListener("click", function () {
  selectedIndex--;
  rotateCarousel();
});

var nextButton = document.querySelector(".next-button");
nextButton.addEventListener("click", function () {
  selectedIndex++;
  rotateCarousel();
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

const handleMouseWheel = debounce((ev) => {
  console.log("hello");
  selectedIndex++;
  rotateCarousel();
}, 50);
// window.addEventListener("wheel", handleMouseWheel);
