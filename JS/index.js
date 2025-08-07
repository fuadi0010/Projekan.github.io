// UNTUK NAVIGATION BAR 

// hilang saat geser kesamping
function showSidebar(){
    const side = document.querySelector('.side');
    side.style.display = 'flex'
}
function hideSide(){
    const side = document.querySelector('.side');
    side.style.display = 'none'
}
// hilang saat geser kesamping
// scroll bawah hilang atas muncul
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    navbar.style.top = "-70px";
  } else {
    navbar.style.top = "0";
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});
// scroll bawah hilang atas muncul