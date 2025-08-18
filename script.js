// ===== Utilities
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

// ===== Theme Toggle with persistence
const themeToggle = $('#themeToggle');
const themeIcon = $('#themeIcon');

function setTheme(mode) {
  const root = document.documentElement;
  const isLight = mode === 'light';
  root.classList.toggle('light', isLight);
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeIcon.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(saved ?? (prefersLight ? 'light' : 'dark'));
})();
themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.classList.contains('light');
  setTheme(isLight ? 'dark' : 'light');
});

// ===== Year
$('#year').textContent = new Date().getFullYear();

// ===== Reveal on Scroll using IntersectionObserver
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$('.reveal-up').forEach(el => io.observe(el));

// ===== Filter logic with smooth transitions
const cards = $$('.card');
const buttons = $$('.filter-btn');

function showCard(card) {
  // Prepare to show
  card.classList.remove('hidden');
  // Force reflow to enable transition from hiding -> normal
  // eslint-disable-next-line no-unused-expressions
  card.offsetHeight;
  card.classList.remove('hiding');
}

function hideCard(card) {
  // Start transition
  card.classList.add('hiding');
  const onEnd = (e) => {
    if (e.propertyName !== 'opacity') return;
    card.classList.add('hidden');
    card.removeEventListener('transitionend', onEnd);
  };
  card.addEventListener('transitionend', onEnd);
}

function applyFilter(filter) {
  buttons.forEach(btn => {
    const active = btn.dataset.filter === filter || (filter === 'all' && btn.dataset.filter === 'all');
    btn.classList.toggle('active', btn.dataset.filter === filter);
    btn.setAttribute('aria-selected', String(btn.classList.contains('active')));
  });

  cards.forEach(card => {
    const categories = (card.dataset.category || '').split(' ');
    const match = filter === 'all' ? true : categories.includes(filter);
    if (match) showCard(card); else hideCard(card);
  });
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
});

// ===== Modal
const modal = $('#modal');
const modalImg = $('#modalImg');
const modalTitle = $('#modalTitle');
const modalDesc = $('#modalDesc');
const modalLink = $('#modalLink');

function openModalFromCard(card) {
  const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Project';
  const desc = card.dataset.desc || card.querySelector('p')?.textContent || '';
  const img = card.dataset.img || card.querySelector('img')?.src || '';
  const link = card.dataset.link || '#';

  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalImg.src = img;
  modalImg.alt = `${title} image`;
  modalLink.href = link;
  modal.showModal();
}

$$('.open-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) openModalFromCard(card);
  });
});

$('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => {
  // Click outside to close
  const dialogRect = modal.getBoundingClientRect();
  if (e.clientX < dialogRect.left || e.clientX > dialogRect.right ||
      e.clientY < dialogRect.top || e.clientY > dialogRect.bottom) {
    modal.close();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.open) modal.close();
});

// ===== Back to top
$('.back-to-top').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // ===== Reveal on Scroll using IntersectionObserver
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal-up').forEach(el => io.observe(el));
});
