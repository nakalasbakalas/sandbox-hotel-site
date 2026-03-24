/* ==========================================================
  Sandbox Hotel — Homepage device detection
========================================================== */
(function(){
  const home = window.SandboxHotelHome = window.SandboxHotelHome || {};
  const root = document.documentElement;
  let resizeT;

  function detectDevice(){
    const w = window.innerWidth || 0;
    const h = window.innerHeight || 0;
    const minSide = Math.min(w || 9999, h || 9999);
    const isTouch = (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
                    ("ontouchstart" in window) ||
                    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

    let device = "desktop";
    if(isTouch){
      device = (minSide <= 680) ? "phone" : "tablet";
    }
    root.setAttribute("data-device", device);
    root.setAttribute("data-compact", device === "desktop" ? "false" : "true");
    root.setAttribute("data-density", device === "desktop" ? "comfortable" : "compact");
  }

  home.initDeviceProfile = detectDevice;
  detectDevice();
  window.addEventListener("resize", ()=>{
    clearTimeout(resizeT);
    resizeT = setTimeout(detectDevice, 150);
  }, { passive:true });
})();
