/* ==========================================================
  Sandbox Hotel — Homepage header scroll behavior
========================================================== */
(function(){
  const home = window.SandboxHotelHome = window.SandboxHotelHome || {};
  // ---------- Header scroll effect ----------
  function initHeaderScroll(){
    const header = document.querySelector("header");
    if(!header) return;

    function checkScroll(){
      if(window.scrollY > 60){
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", checkScroll, {passive:true});
    checkScroll();
  }

  home.initHeaderScroll = initHeaderScroll;
})();
