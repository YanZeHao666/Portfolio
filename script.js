const root = document.documentElement;
const scroller = document.querySelector("#site-scroll");
const siteNav = document.querySelector(".site-nav");
const reveals = document.querySelectorAll(
  ".reveal-left, .reveal-right, .reveal-up, .reveal-down, .reveal-fade, .reveal-row, .reveal-zoom"
);
const navLinks = document.querySelectorAll(".nav-pill a");
const modal = document.querySelector("[data-modal]");
const menu = document.querySelector("[data-nav]");
const projectDetailModal = document.querySelector("[data-project-detail-modal]");
const projectDetailPanel = projectDetailModal?.querySelector(".project-detail-panel");
const projectDetailImage = projectDetailModal?.querySelector(".project-detail-image");
const backgroundVideo = document.querySelector("[data-video-slot]");
const ambientBackgroundVideo = document.querySelector("[data-video-ambient]");
const characterHeadSprites = Array.from(document.querySelectorAll(".character-head-sprite"));
let backgroundAnimationFrame = null;
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight * 0.2;
let activeHeadSpriteIndex = 0;
let currentHeadFrame = "2-1";

const projectDetailGalleries = {
  "business-website": {
    label: "Business Website Design 完整作品",
    images: Array.from({ length: 9 }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      return {
        src: `./assets/project-show/01-business-website-design/business-website-preview-${number}.webp`,
        width: 1280,
        height: index === 8 ? 867 : 2048,
      };
    }),
  },
  "b2b-design": {
    label: "B2B Design 完整作品",
    images: Array.from({ length: 5 }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      return {
        src: `./assets/project-show/02-b2b-design/b2b-design-preview-${number}.webp`,
        width: 1280,
        height: index === 4 ? 384 : 2048,
      };
    }),
  },
  "mobile-app": {
    label: "Mobile APP Design 完整作品",
    images: Array.from({ length: 14 }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      return {
        src: `./assets/project-show/03-mobile-app-design/mobile-app-preview-${number}.webp`,
        width: 1280,
        height: index === 13 ? 1661 : 2048,
      };
    }),
  },
  "visual-exploration": {
    label: "AIGC Visual Exploration 完整作品",
    images: Array.from({ length: 9 }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");
      return {
        src: `./assets/project-show/04-aigc-visual-exploration/visual-exploration-preview-${number}.webp`,
        width: 1280,
        height: index === 8 ? 1307 : 2048,
      };
    }),
  },
};

const scheduleBackgroundFrame = () => {
  if (backgroundAnimationFrame === null) {
    backgroundAnimationFrame = window.requestAnimationFrame(updateBackgroundFrame);
  }
};

const setHeadDirection = (column, row) => {
  const frameKey = `${column}-${row}`;
  if (frameKey === currentHeadFrame || characterHeadSprites.length < 2) return;

  const nextSpriteIndex = activeHeadSpriteIndex === 0 ? 1 : 0;
  const currentSprite = characterHeadSprites[activeHeadSpriteIndex];
  const nextSprite = characterHeadSprites[nextSpriteIndex];
  const positionX = `${column * 25}%`;
  const positionY = `${row * 50}%`;

  nextSprite.style.backgroundPosition = `${positionX} ${positionY}`;
  nextSprite.classList.add("is-active");
  currentSprite.classList.remove("is-active");

  activeHeadSpriteIndex = nextSpriteIndex;
  currentHeadFrame = frameKey;
};

const updateBackgroundFrame = () => {
  backgroundAnimationFrame = null;
  const normalizedX = pointerX / window.innerWidth - 0.5;
  const normalizedY = pointerY / window.innerHeight - 0.5;
  const lookX = Math.max(-1, Math.min(1, normalizedX * 2));
  const lookY = Math.max(-1, Math.min(1, normalizedY * 2));

  root.style.setProperty("--mx", `${pointerX}px`);
  root.style.setProperty("--my", `${pointerY}px`);
  root.style.setProperty("--video-pan-x", `${lookX * -0.45}%`);
  root.style.setProperty("--video-pan-y", `${lookY * -0.25}%`);
  root.style.setProperty("--head-shift-x", `${lookX * 1.4}px`);
  root.style.setProperty("--head-shift-y", `${lookY * 0.8}px`);
  root.style.setProperty("--body-shift-x", `${lookX * 0.8}px`);
  root.style.setProperty("--body-shift-y", `${lookY * 0.4}px`);

  const column = lookX < -0.62 ? 0 : lookX < -0.2 ? 1 : lookX <= 0.2 ? 2 : lookX <= 0.62 ? 3 : 4;
  const row = lookY < -0.28 ? 0 : lookY <= 0.28 ? 1 : 2;
  setHeadDirection(column, row);
};

backgroundVideo?.addEventListener("canplay", () => {
  backgroundVideo.play().catch(() => {});
  if (ambientBackgroundVideo) {
    ambientBackgroundVideo.currentTime = backgroundVideo.currentTime;
    ambientBackgroundVideo.play().catch(() => {});
  }
});

window.addEventListener("mousemove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  scheduleBackgroundFrame();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    root: scroller,
    threshold: 0.12,
  }
);

reveals.forEach((element, index) => {
  const requestedDelay = Number.parseInt(element.dataset.revealDelay ?? "", 10);
  const delay = Number.isFinite(requestedDelay) ? requestedDelay : Math.min(index * 35, 260);
  element.style.transitionDelay = `${delay}ms`;
  revealObserver.observe(element);
});

window.requestAnimationFrame(() => {
  window.requestAnimationFrame(() => {
    siteNav?.classList.add("is-visible");
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    root: scroller,
    threshold: 0.45,
  }
);

document.querySelectorAll(".section").forEach((section) => {
  sectionObserver.observe(section);
});

document.querySelector("[data-menu-button]")?.addEventListener("click", () => {
  menu.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
  });
});

document.querySelectorAll("[data-open-contact]").forEach((button) => {
  button.addEventListener("click", () => {
    modal.hidden = false;
  });
});

document.querySelector("[data-close-contact]")?.addEventListener("click", () => {
  modal.hidden = true;
});

const copyToast = document.querySelector("[data-copy-toast]");
let copyToastTimer = null;

const copyText = async (value) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

document.querySelectorAll("[data-copy-wechat]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copyValue || "";
    try {
      await copyText(value);
      if (!copyToast) return;
      copyToast.textContent = `微信号 ${value} 已复制`;
      copyToast.classList.add("is-visible");
      window.clearTimeout(copyToastTimer);
      copyToastTimer = window.setTimeout(() => {
        copyToast.classList.remove("is-visible");
      }, 1800);
    } catch {
      if (!copyToast) return;
      copyToast.textContent = `复制失败，请手动复制：${value}`;
      copyToast.classList.add("is-visible");
    }
  });
});

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) {
    modal.hidden = true;
  }
  if (event.key === "Escape" && projectDetailModal && !projectDetailModal.hidden) {
    closeProjectDetail();
  }
});

document.querySelectorAll(".masonry-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (item.matches("[data-open-media-detail]")) return;
    item.classList.toggle("selected");
  });
});

document.querySelectorAll(".project-item").forEach((item) => {
  item.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    item.classList.toggle("open");
  });
});

const renderProjectDetail = (projectKey) => {
  const gallery = projectDetailGalleries[projectKey] || projectDetailGalleries["mobile-app"];
  if (!projectDetailImage) return gallery;
  projectDetailImage.replaceChildren(
    ...gallery.images.map((image, index) => {
      const img = document.createElement("img");
      img.src = image.src;
      img.width = image.width;
      img.height = image.height;
      img.alt = index === 0 ? gallery.label : "";
      img.decoding = "async";
      if (index > 0) img.loading = "lazy";
      return img;
    })
  );
  projectDetailModal?.setAttribute("aria-label", gallery.label);
  return gallery;
};

const openProjectDetail = (event) => {
  event.stopPropagation();
  if (!projectDetailModal) return;
  renderProjectDetail(event.currentTarget.dataset.projectDetail);
  projectDetailModal.hidden = false;
  document.body.classList.add("project-detail-open");
  if (projectDetailPanel) projectDetailPanel.scrollTop = 0;
};

document.querySelectorAll("[data-open-project-detail]").forEach((button) => {
  button.addEventListener("click", openProjectDetail);
});

const renderMediaDetail = (button) => {
  if (!projectDetailImage) return;
  const type = button.dataset.mediaType;
  const src = button.dataset.mediaSrc;
  const label = button.dataset.mediaLabel || button.getAttribute("aria-label") || "Other creation";
  if (!src) return;

  if (type === "video") {
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("aria-label", label);
    projectDetailImage.replaceChildren(video);
  } else {
    const img = document.createElement("img");
    img.src = src;
    img.alt = label;
    img.decoding = "async";
    projectDetailImage.replaceChildren(img);
  }

  projectDetailModal?.setAttribute("aria-label", label);
};

document.querySelectorAll("[data-open-media-detail]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!projectDetailModal) return;
    renderMediaDetail(button);
    projectDetailModal.hidden = false;
    document.body.classList.add("project-detail-open");
    if (projectDetailPanel) projectDetailPanel.scrollTop = 0;
  });
});

const closeProjectDetail = () => {
  if (!projectDetailModal) return;
  projectDetailImage?.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.removeAttribute("src");
    video.load();
  });
  projectDetailModal.hidden = true;
  document.body.classList.remove("project-detail-open");
};

document.querySelector("[data-close-project-detail]")?.addEventListener("click", closeProjectDetail);

projectDetailModal?.addEventListener("click", (event) => {
  if (event.target === projectDetailModal) {
    closeProjectDetail();
  }
});
