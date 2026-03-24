/* ==========================================================
  Sandbox Hotel — Homepage gallery carousel
========================================================== */
(function(){
  const home = window.SandboxHotelHome = window.SandboxHotelHome || {};
  // ---------- Carousel (gallery only) ----------
  function initGalleryCarousel(){
    const carousel = document.getElementById("galCarousel");
    const viewport = document.getElementById("galViewport");
    const track = document.getElementById("galTrack");
    const dotsWrap = document.getElementById("galDots");
    const thumbsWrap = document.getElementById("galThumbs");
    const prevBtn = document.getElementById("galPrev");
    const nextBtn = document.getElementById("galNext");
    if(!carousel || !viewport || !track || !dotsWrap || !prevBtn || !nextBtn) return;

    const slides = Array.from(track.querySelectorAll(".galSlide"));
    if(slides.length <= 1){
      dotsWrap.style.display = "none";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      return;
    }

    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let idx = 0;
    let timer = null;

    function setIndex(i){
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${-idx * 100}%)`;
      dotsWrap.querySelectorAll(".galDot").forEach((b,bi)=>{
        b.setAttribute("aria-current", bi === idx ? "true" : "false");
      });
      thumbsWrap?.querySelectorAll(".galThumb").forEach((b,bi)=>{
        b.setAttribute("aria-current", bi === idx ? "true" : "false");
      });
      const statusEl = document.getElementById("galStatus");
      if(statusEl) statusEl.textContent = `Slide ${idx + 1} of ${slides.length}`;
    }

    function buildDots(){
      dotsWrap.innerHTML = "";
      slides.forEach((_,i)=>{
        const b = document.createElement("button");
        b.type = "button";
        b.className = "galDot";
        b.setAttribute("aria-label", `Photo ${i+1}`);
        b.setAttribute("aria-current", i === 0 ? "true" : "false");
        b.addEventListener("click", ()=>{ stop(); setIndex(i); start(); });
        dotsWrap.appendChild(b);
      });
    }

    function buildThumbs(){
      if(!thumbsWrap) return;
      thumbsWrap.innerHTML = "";
      slides.forEach((slide,i)=>{
        const img = slide.querySelector(".mediaImg");
        if(!img) return;
        const b = document.createElement("button");
        const thumbImg = document.createElement("img");
        b.type = "button";
        b.className = "galThumb";
        b.setAttribute("aria-label", img.alt || `Photo ${i+1}`);
        b.setAttribute("aria-current", i === 0 ? "true" : "false");
        thumbImg.src = img.getAttribute("src") || "";
        thumbImg.srcset = img.getAttribute("srcset") || "";
        thumbImg.sizes = "160px";
        thumbImg.alt = "";
        thumbImg.loading = "lazy";
        thumbImg.decoding = "async";
        thumbImg.width = 160;
        thumbImg.height = 120;
        b.appendChild(thumbImg);
        b.addEventListener("click", ()=>{ stop(); setIndex(i); start(); });
        thumbsWrap.appendChild(b);
      });
    }

    function start(){
      if(prefersReduce) return;
      stop();
      timer = setInterval(()=> setIndex(idx + 1), 6500);
    }

    function stop(){
      if(timer){ clearInterval(timer); timer = null; }
    }

    prevBtn.addEventListener("click", ()=>{ stop(); setIndex(idx - 1); start(); });
    nextBtn.addEventListener("click", ()=>{ stop(); setIndex(idx + 1); start(); });

    carousel.addEventListener("pointerenter", stop, {passive:true});
    carousel.addEventListener("pointerleave", start, {passive:true});
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    // Swipe / drag
    let sx = null;
    viewport.addEventListener("pointerdown", (e)=>{
      sx = e.clientX;
      try{ viewport.setPointerCapture(e.pointerId); } catch(_e){}
    }, {passive:true});
    viewport.addEventListener("pointerup", (e)=>{
      if(sx === null) return;
      const dx = e.clientX - sx;
      sx = null;
      if(Math.abs(dx) < 40) return;
      stop();
      if(dx < 0) setIndex(idx + 1); else setIndex(idx - 1);
      start();
    }, {passive:true});

    // Keyboard
    viewport.addEventListener("keydown", (e)=>{
      if(e.key === "ArrowLeft"){ e.preventDefault(); stop(); setIndex(idx - 1); start(); }
      else if(e.key === "ArrowRight"){ e.preventDefault(); stop(); setIndex(idx + 1); start(); }
    });

    buildDots();
    buildThumbs();
    setIndex(0);
    start();
  }

  home.initGalleryCarousel = initGalleryCarousel;
})();
