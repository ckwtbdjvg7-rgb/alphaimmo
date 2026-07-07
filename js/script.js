const realPhone = '+41767621354';
const visiblePhone = '+41 76 762 13 54';

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

function supportsWebPFormat() {
  try {
    return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
}

const heroMedia = document.getElementById('heroMedia');
const heroFallback = document.getElementById('hero');
if (heroMedia || heroFallback) {
  const heroExt = supportsWebPFormat() ? 'webp' : 'jpg';
  const heroes = [`img/hero-01.${heroExt}`, `img/hero-02.${heroExt}`, `img/hero-03.${heroExt}`];
  const lastHero = localStorage.getItem('alphaLastHero');
  const choices = heroes.filter(h => h !== lastHero);
  const selectedHero = choices[Math.floor(Math.random() * choices.length)] || heroes[0];
  localStorage.setItem('alphaLastHero', selectedHero);

  if (heroMedia) {
    const heroSource = heroMedia.querySelector('source');
    const heroImg = heroMedia.querySelector('img');
    const selectedBase = selectedHero.replace(/\.(webp|jpg)$/, '');
    if (heroSource) heroSource.srcset = `${selectedBase}.webp`;
    if (heroImg) {
      heroImg.src = `${selectedBase}.jpg`;
      heroImg.alt = 'Hochwertiges modernes Wohnhaus';
    }
  } else if (heroFallback) {
    heroFallback.style.setProperty('--hero-image', `url('${selectedHero}')`);
  }
}

document.querySelectorAll('.phone-button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.phoneVisible !== 'true') {
      btn.textContent = btn.textContent.trim().startsWith('Telefon:') ? 'Telefon: ' + visiblePhone : visiblePhone;
      btn.dataset.phoneVisible = 'true';
    } else {
      window.location.href = 'tel:' + realPhone;
    }
  });
});

const sticky = document.getElementById('stickyBar');
if (sticky) {
  window.addEventListener('scroll', () => sticky.classList.toggle('visible', window.scrollY > 170), { passive: true });
}

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 })
  : null;

if (observer) {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

const grid = document.getElementById('galleryGrid');
const lb = document.getElementById('lightbox');
if (grid && lb) {
  const galleryImages = Array.from({ length: 16 }, (_, i) => `img/gallery-${String(i + 1).padStart(2, '0')}.jpg`)
    .concat(['img/gallery-17.jpg', 'img/gallery-18.jpg', 'img/gallery-19.jpg', 'img/gallery-20.jpg', 'img/gallery-21.jpg', 'img/gallery-22.jpg']);
  let current = 0;

  galleryImages.forEach((src, i) => {
    const btn = document.createElement('button');
    btn.className = 'gallery-item reveal';
    const webp = src.replace('.jpg', '.webp');
    btn.innerHTML = `<picture><source srcset="${webp}" type="image/webp"><img src="${src}" alt="Referenzbild ${i + 1}" loading="lazy"></picture>`;
    btn.addEventListener('click', () => openLightbox(i));
    grid.appendChild(btn);
    if (observer) observer.observe(btn);
  });

  const lbImg = lb.querySelector('img');
  function openLightbox(i) { current = i; lbImg.src = galleryImages[current]; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); }
  function closeLightbox() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
  function next() { current = (current + 1) % galleryImages.length; lbImg.src = galleryImages[current]; }
  function prev() { current = (current - 1 + galleryImages.length) % galleryImages.length; lbImg.src = galleryImages[current]; }

  const closeBtn = lb.querySelector('.lightbox-close');
  const nextBtn = lb.querySelector('.lightbox-next');
  const prevBtn = lb.querySelector('.lightbox-prev');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
}
