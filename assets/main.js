/* global gsap, ScrollTrigger, ScrollToPlugin, CustomEase, TextPlugin */
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase, TextPlugin);
ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    const percentage = Math.round(self.progress * 100);
    document.querySelector(".scroll-percentage").textContent = percentage + "%";

    document.querySelector(".scroll-indicator-fill").style.width =
      `${percentage}%`;
  },
});
// history.scrollRestoration = "manual";

// 화면 부드럽게
const lenis = new Lenis({
  duration: 1.7,
  easing: (t) => 1 - Math.pow(1 - t, 3),
  direction: "vertical",
  smooth: true,
  mouseMultiplier: 0.5,
  smoothTouch: false,
  touchMultiplier: 1.5,
  infinite: false,
  wrapper: window,
  content: document.documentElement,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// 애니메이션
gsap.to(".sc-home .title, .sc-home .bg-layer ,.sc-home .desc", {
  y: 100,
  scrollTrigger: {
    trigger: ".sc-video-01",
    start: "top bottom",
    end: "top top",
    scrub: 1.5,
    // markers: true,
  },
});

// sc-video-01
gsap.set(".fill-text ", { scale: 0.7, opacity: 0 });
gsap.set(".sc-video-01 .bg-shape", {
  scale: 0.7,
  opacity: 0,
  xPercent: -50,
  yPercent: -50,
  x: 0,
  y: 0,
});
gsap.to(".fill-text , .sc-video-01 .bg-shape", {
  opacity: 1,
  scale: 1,
  scrollTrigger: {
    trigger: ".sc-home",
    start: "bottom 30%",
    // markers: true,
    scrub: 1,
  },
});

gsap.from(".ic-sofi-moon", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".sc-video-01",
    start: "top top",
    end: "+=100%",
    // markers: true,
    scrub: 1,
  },
});

// 공통 함수: 이미지 시퀀스 로더
function createImageSequence(config) {
  const {
    canvasSelector,
    imagePath,
    startFrame = 1,
    frameCount,
    canvasWidth,
    canvasHeight,
    useWindowSize = false,
  } = config;

  const canvas = document.querySelector(canvasSelector);
  const ctx = canvas.getContext("2d");

  // 캔버스 크기 설정
  if (useWindowSize) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  } else if (canvasWidth && canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  } else {
    // CSS 크기에 맞춤
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  const images = [];
  const card = { frame: 0 };

  // 이미지 경로 생성
  const getFramePath = (idx) => {
    return `${imagePath}/${String(idx).padStart(4, "0")}.webp`;
  };

  // 이미지 사전 로드
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = getFramePath(startFrame + i);
    images.push(img);
  }

  // 렌더링 함수
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[card.frame], 0, 0, canvas.width, canvas.height);
  }

  // 첫 이미지 로드 시 렌더링
  images[0].onload = render;

  // 리사이즈 핸들러
  function handleResize() {
    if (!useWindowSize) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      render();
    }
  }

  return {
    canvas,
    ctx,
    images,
    card,
    frameCount,
    render,
    handleResize,
  };
}

// Canvas-01
const sequence01 = createImageSequence({
  canvasSelector: "#canvas",
  imagePath: "/assets/images/video_pod_emerges",
  startFrame: 7,
  frameCount: 274,
  useWindowSize: true,
});

// 텍스트 채워짐 효과
function initTextFillEffect() {
  new SplitType(".fill-text", { types: "lines" });
  $(".fill-text .line").wrap('<div class="line-wrap">');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-video-01",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  gsap.set("#canvas", { opacity: 0 });

  document.querySelectorAll(".fill-text .line").forEach((line) => {
    tl.to(line, {
      backgroundPosition: "0% 0",
      ease: "none",
    });
  });

  tl.to(".sc-video-01 .text-area", {
    opacity: 0,
    scale: 1.1,
    duration: 0.3,
    ease: "power1.inOut",
  });

  tl.to("#canvas", {
    opacity: 1,
    duration: 1,
    ease: "power2.inOut",
  }).to(
    ".sc-video-01 .bg-shape",
    {
      width: "1800px",
      // height: "1160px",
      // width: "1920px",
      height: "1640px",
      borderRadius: 0,
      duration: 1,
      ease: "power2.inOut",
    },
    "<",
  );

  tl.to(sequence01.card, {
    frame: sequence01.frameCount - 1,
    snap: "frame",
    ease: "power2.inOut",
    onUpdate: sequence01.render,
    duration: 1,
  });
}

initTextFillEffect();

// intro 후
const split = new SplitType(".title-word", { types: "chars,lines" });
gsap.set(".bg-layer", {
  x: -50,
  y: 50,
});
gsap.set(".desc", {
  y: "100%",
});

function disableScroll() {
  // Lenis 스무스 스크롤 비활성화
  lenis.stop();

  // 기본 스크롤도 비활성화
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

function enableScroll() {
  // Lenis 스무스 스크롤 재활성화
  lenis.start();

  // 기본 스크롤 복원
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

// 애니메이션 시작 전 스크롤 비활성화
disableScroll();

const introMotionTl = gsap.timeline({
  onComplete: () => {
    // 타임라인 완료 후 스크롤 활성화
    enableScroll();
  },
});

introMotionTl
  .to(".fixed-bottom, #header nav", {
    y: 0,
    duration: 0.8,
    ease: "power1.inOut",
  })

  .to(split.chars, {
    y: 0,
    duration: 1,
    ease: "power1.inOut",
    stagger: 0.08,
  })

  .to(
    ".desc",
    {
      y: 0,
      duration: 0.8,
      opacity: 1,
      ease: "power1.inOut",
    },
    "-=1",
  )

  .to(
    ".shop-wrap",
    {
      duration: 0.8,
      opacity: 1,
      ease: "power1.inOut",
    },
    "-=0.7",
  )

  .to(
    ".bg-layer",
    {
      x: 0,
      y: 0,
      duration: 0.8,
      opacity: 1,
      ease: "power1.inOut",
    },
    "-=1",
  );

// Canvas-02
const sequence02 = createImageSequence({
  canvasSelector: "#canvas-02",
  imagePath: "/assets/images/video_pod_rotation",
  startFrame: 1,
  frameCount: 194,
});

// 리사이즈 이벤트
window.addEventListener("resize", sequence02.handleResize);

// 스크롤 애니메이션
ScrollTrigger.create({
  trigger: ".sc-video-02",
  start: "top bottom",
  end: "bottom top",
  scrub: 0.2,
  onUpdate: (self) => {
    const loopFrame = Math.floor(self.scroll() * 0.2) % sequence02.frameCount;
    sequence02.card.frame = loopFrame;
    sequence02.render();
  },
});

function initVideo02Animation() {
  const blackTitle = new SplitType(".sc-video-02 .black-title h2", {
    types: "chars",
  });

  gsap.set(".sc-video-02 .top, .sc-video-02 .bot", {
    opacity: 0,
  });
  gsap.set(blackTitle.chars, { y: "100%" });
  gsap.set(".sc-video-02 .top", { y: "-100%" });
  gsap.set(".sc-video-02 .bot", { y: "100%" });

  gsap.set(".sc-video-02 .feature-wrap .icon svg", { y: "100%" });
  gsap.set(".sc-video-02 .feature-wrap .title h2", { y: "100%" });
  gsap.set(".sc-video-02 .feature-wrap .desc p", { y: "100%" });
  gsap.set(".sc-video-02 .feature-01 .divider-line", {
    scaleX: 0,
    transformOrigin: "right center",
  });
  gsap.set(".sc-video-02 .feature-02 .divider-line", {
    scaleX: 0,
    transformOrigin: "left center",
  });
  gsap.set(".sc-video-02 .feature-wrap .divider-dot", {
    opacity: 0,
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".sc-video-02 ",
        start: "top 80%",
        end: "30% top",
        scrub: 1,
        // markers: true,
      },
    })
    .to(blackTitle.chars, {
      y: "0%",
      duration: 1,
      ease: "power2.out",
      stagger: 0.05,
    });

  //  메인 가로 스크롤 애니메이션
  const mainYscrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sc-video-02",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      anticipatePin: 1,
    },
  });

  // 가로 스크롤 실행
  mainYscrollTl
    .to([".sc-video-02 .top", ".sc-video-02 .bot"], {
      y: "0%",
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    })
    .to(".sc-video-02 .black-title", {
      transform: "translate(-105%, 0%)",
      duration: 0.7,
      ease: "power2.inOut",
    })

    .to(
      [".sc-video-02 .top", ".sc-video-02 .bot"],
      {
        opacity: 0,
        ease: "power2.out",
      },
      "<+=0.1",
    )

    .to(
      ".sc-video-02 .circle-wrap .circle",
      {
        scale: 1.1,
        duration: 1,
        ease: "power2.out",
      },
      "<+=0.1",
    )

    .to(
      ".sc-video-02 .circle-wrap .circle",
      {
        borderRadius: 0,
      },
      "a",
    )

    .to(
      ".white-title",
      {
        transform: " translate(-3024px, -50%)",
        duration: 1.2,
        ease: "power2.inOut",
      },
      "a-=0.8",
    )
    .to(".sc-video-02 .feature-wrap", {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    })

    //  Feature-wrap 등장
    .to(
      ".sc-video-02 .divider-dot",
      { opacity: 1, duration: 1, ease: "power2.out" },
      "<",
    )
    .to(
      ".sc-video-02 .feature-01 .divider-line",
      {
        duration: 1,
        scaleX: 1,
        transformOrigin: "right center",
        ease: "power2.out",
      },
      "<",
    )
    .to(
      ".sc-video-02 .feature-02 .divider-line",
      {
        duration: 1,
        scaleX: 1,
        transformOrigin: "left center",
        ease: "power2.out",
      },
      "<",
    )
    .to(
      ".sc-video-02 .feature-wrap .feature-01 .feature-inner:first-child .icon svg, \
   .sc-video-02 .feature-wrap .feature-01 .feature-inner:first-child .title h2, \
   .sc-video-02 .feature-wrap .feature-01 .feature-inner:first-child .desc p",
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "a+=0.1",
    )
    .to(
      ".sc-video-02 .feature-wrap .feature-02 .feature-inner:first-child .icon svg, \
   .sc-video-02 .feature-wrap .feature-02 .feature-inner:first-child .title h2, \
   .sc-video-02 .feature-wrap .feature-02 .feature-inner:first-child .desc p",
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "a",
    )
    .to(
      ".sc-video-02 .feature-wrap .feature-01 .feature-inner:first-child .icon svg, \
   .sc-video-02 .feature-wrap .feature-01 .feature-inner:first-child .title h2, \
   .sc-video-02 .feature-wrap .feature-01 .feature-inner:first-child .desc p",
      {
        y: -100,
        duration: 0.5,
        ease: "power2.out",
      },
    )
    .to(
      ".sc-video-02 .feature-wrap .feature-01 .feature-inner:last-child .icon svg, \
   .sc-video-02 .feature-wrap .feature-01 .feature-inner:last-child .title h2, \
   .sc-video-02 .feature-wrap .feature-01 .feature-inner:last-child .desc p",
      {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
    )
    .to(
      ".sc-video-02 .feature-wrap .feature-02 .feature-inner:first-child .icon svg, \
   .sc-video-02 .feature-wrap .feature-02 .feature-inner:first-child .title h2, \
   .sc-video-02 .feature-wrap .feature-02 .feature-inner:first-child .desc p",
      {
        y: -100,
        duration: 0.5,
        ease: "power2.out",
      },
    )
    .to(
      ".sc-video-02 .feature-wrap .feature-02 .feature-inner:last-child .icon svg, \
   .sc-video-02 .feature-wrap .feature-02 .feature-inner:last-child .title h2, \
   .sc-video-02 .feature-wrap .feature-02 .feature-inner:last-child .desc p",
      {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
    )
    .to(".sc-video-02 .circle-wrap .circle", {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    })
    .to(
      ".sc-video-02 .feature-wrap .icon svg path",
      {
        fill: "#000000",
      },
      "<",
    )
    .to(
      ".sc-video-02 .feature-wrap .title h2",
      {
        color: "#000000",
      },
      "<",
    )
    .to(
      ".sc-video-02 .feature-wrap .desc p",
      {
        color: " #121212",
      },
      "<",
    );
}

initVideo02Animation();

gsap.to(".sc-passiflora .text-wrap .title", {
  xPercent: -100,
  x: "-100vw",
  scrollTrigger: {
    trigger: ".sc-passiflora",
    start: "top top",
    duration: 0.2,
    scrub: 1,
    invalidateOnRefresh: true,
  },
});
gsap.to(".sc-passiflora .text-wrap .subtitle", {
  opacity: 0,
  duration: 0.2,
  scrollTrigger: {
    trigger: ".sc-passiflora",
    start: "top center",
    scrub: true,
    // markers: true,
  },
});
gsap.to(".sc-passiflora .img-wrap img", {
  scale: 1,
  scrollTrigger: {
    trigger: ".sc-passiflora",
    start: "top top",
    scrub: 1,
    // markers: true,
  },
});
const infoTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-passiflora ",
    start: "bottom bottom",
    toggleActions: "play none none reverse",
    // markers: true,
  },
});

infoTl
  .to(".sc-passiflora .info-area .divider", {
    scaleX: 1,
    duration: 0.6,
    ease: "power2.out",
  })
  .to(
    ".sc-passiflora .info-area .title",
    { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
    "a",
  )
  .fromTo(
    ".sc-passiflora .info-area .desc .desc-text",
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: {
        amount: 0.3,
        from: "start",
      },
    },
    "a",
  );

//
const capsulesTl = gsap.timeline({
  defaults: { ease: "power2.out", duration: 0.5 },
  scrollTrigger: {
    trigger: ".sc-capsules",
    start: "top center",
    end: "bottom bottom",
    toggleActions: "play reverse play reverse",
    // markers: true,
  },
});

capsulesTl
  .to("body", { backgroundColor: "#000" }, 0)
  .to(".sc-capsules .card", { backgroundColor: "#121212" }, 0)
  .to(".sc-capsules .title.change-color-01", { color: "#fff" }, 0)
  .to(".sc-capsules .change-color-02", { color: "#f7f7f7" }, 0)
  .to(".sc-capsules .capsule-color", { color: "#fff" }, 0)
  .to(".sc-capsules .bot svg path", { stroke: "#fff" }, 0);

// sc-break-title
new SplitType(".sc-break-title .split-text ", { types: "lines" });

$(".sc-break-title .split-text .line").wrap('<div class="line-wrap">');

const breakTitleTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-break-title",
    start: "top 60%",
    end: "bottom bottom",
    scrub: 1,
    // markers: true,
  },
});

document
  .querySelectorAll(".sc-break-title .split-text .line")
  .forEach((line) => {
    breakTitleTl.to(line, {
      backgroundPosition: "0% 0",
      ease: "none",
    });
  });

// sc-testimonials
const testimonialsTl = gsap.timeline({
  defaults: { ease: "power4.out", duration: 0.2 },
  scrollTrigger: {
    trigger: ".sc-testimonials",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.3,
    // markers: true,
  },
});

testimonialsTl
  .to(".sc-testimonials .headline", {
    scale: 1.1,
    opacity: 0,
  })
  .to(".sc-testimonials .list", {
    scale: 1,
    opacity: 1,
  });

gsap.to(".sc-break-img img", {
  scale: 1.3,
  scrollTrigger: {
    trigger: ".sc-break-img",
    start: "top bottom",
    scrub: 0.3,
  },
});

// footer

new SplitType("#footer .title-main", { types: "chars" });

gsap.set("#footer .title-main .char", {
  y: "120%",
});
gsap.set("#footer .title-kicker, .copyright", {
  opacity: 0,
});
gsap.set("#footer .title svg", {
  scale: 0,
});

const footerTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#footer ",
    toggleActions: "play none none reverse",
    start: "center center",
    // markers: true,
  },
});
gsap.to("#footer .inner-footer", {
  y: () => {
    const footer = document.querySelector("#footer");
    return footer.offsetHeight * 0.5;
  },
  scrollTrigger: {
    trigger: "#footer",
    start: "center bottom",
    end: "bottom bottom",
    scrub: 1,
  },
});
footerTl
  .to(
    ".title-main .char",
    {
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.02,
    },
    "<",
  )
  .to(
    ".title-kicker",
    {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.09,
    },
    "<",
  )
  .to(
    "#footer .title svg",
    {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.04,
    },
    "<=+0.2",
  )
  .to(".copyright", {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
  });

// sc-application
new SplitType(".sc-application .split-text2 ", { types: "lines" });

$(".sc-application .split-text2 .line").wrap('<div class="line-wrap">');

const applicationTitle = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-application .title",
    start: "top 80%",
    end: "bottom center",
    scrub: 1,
    // markers: true,
  },
});

document
  .querySelectorAll(".sc-application .split-text2 .line")
  .forEach((line) => {
    applicationTitle.to(line, {
      backgroundPosition: "0% 0",
      ease: "none",
    });
  });

const screenAreaTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".sc-application .sticky-wrap",
    start: "top top",
    end: "bottom bottom",
    scrub: 0,
    // markers: true,
  },
});

screenAreaTl
  .to(".sc-application .screen-left", { opacity: 0, y: -100 }, "<")
  .to(".sc-application .screen-right", { opacity: 0, y: 100 }, "<")
  .to(".sc-application .text-area .text-left", { opacity: 1, y: 0 }, "a")
  .to(".sc-application .text-area .text-right", { opacity: 1, y: 0 }, "a")
  .to(".sc-application .home", { opacity: 0, y: 100 })

  .to(
    ".sc-application .journal-scroll",
    5,
    {
      y: () => {
        const journalScroll = document.querySelector(
          ".sc-application .journal-scroll",
        );
        return -(journalScroll.scrollHeight - 720);
      },
    },
    "c",
  )
  .to(".sc-application .journal-scroll", 0.5, { opacity: 1 }, "c")

  .to(
    ".sc-application .img-moon,.sc-application .img-sun",
    5,
    {
      rotation: 360,
      // duration: 2,
    },
    "c",
  );

gsap.defaults({
  ease: "none",
});
