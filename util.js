const video = document.getElementById("works__background-video");
const source = document.getElementById("works__background-source");
const imageModal = document.querySelector("#image-modal");
const gallery = document.querySelectorAll("#photos__gallery img");
var selectedImage = document.querySelector("#modal-image");
const works = document.getElementsByClassName("works__link");

function lazyLoad() {
  lazyLoaded = true;
  for (let i = 0; i < gallery.length; i++) {
    gallery[i].src = gallery[i].dataset.src;
  }
}

// Plays show reel when hovering over a performance work link
function setWorksBackground(file) {
  source.src = file;
  video.pause();
  video.load();
  video.play();
  video.classList.add("visible");
}

// Removes the show reel from background on mouseout
function removeWorksBackground() {
  video.pause();
  source.src = "";
  video.load();
  video.classList.remove("visible");
}

// Add the mousover/mouseout events to all performance recording links
for (let i = 0; i < works.length; i++) {
  works[i].addEventListener(
    "mouseover",
    setWorksBackground.bind(this, works[i].dataset.videosnippet)
  );
  works[i].addEventListener("mouseleave", removeWorksBackground);
}

for (let i = 0; i < gallery.length; i++) {
  gallery[i].addEventListener("click", () => {
    handleImageClick(gallery[i].dataset.src);
  });
}

function handleImageClick(photo) {
  imageModal.classList.add("show");
  selectedImage.src = photo;
}

function closeModal() {
  imageModal.classList.remove("show");
}

// ** Enabling these two lines adds swiping between slides on mobile **
// document.addEventListener("touchstart", handleTouchStart, false);
// document.addEventListener("touchmove", handleTouchMove, false);

// *************************************************************
// ******************* MOBILE SWIPING CODE *********************
// *************************************************************
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
      // Swipe left
      selectedIndex++;
      rotateCarousel();
      !lazyLoaded && lazyLoad();
    } else {
      // Swipe right
      selectedIndex--;
      rotateCarousel();
      !lazyLoaded && lazyLoad();
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}
