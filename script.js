// ========== Portfolio Script (grid render + accents + links) ==========

const grid = document.getElementById('grid');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const gh = document.getElementById('ghLink');
const li = document.getElementById('liLink');
if (gh) gh.href = 'https://github.com/heathergauthier2018';
if (li) li.href = 'https://www.linkedin.com/in/heather-gauthier-11903a2a3/';

const FALLBACK_ITEMS = [
  {
    title: "Cocktail Studio (Random + Search)",
    description: "Single-page app combining a random generator with a search explorer. Favorites saved in localStorage.",
    tags: ["HTML","CSS","JavaScript","API","localStorage","Accessibility"],
    demo: "https://heathergauthier2018.github.io/cocktail-finder/",
    repo: "https://github.com/heathergauthier2018/cocktail-finder",
    image: "thumbs/random-cocktail.jpg"
  },
  {
    title: "World Map (Angular, Expanded)",
    description: "Interactive SVG world map in Angular with country details from the World Bank API. Routing and richer interactions beyond the course baseline.",
    tags: ["Angular","TypeScript","SVG","HTTPClient","Routing","API"],
    demo: "#",
    repo: "#",
    image: "thumbs/world-map.jpg"
  },
  {
    title: "D277 Front-End Web Development",
    description: "Responsive multi-page site showing semantic HTML, modern CSS (Flexbox/Grid), and vanilla JS interactivity.",
    tags: ["HTML","CSS","JavaScript","Accessibility","Responsive"],
    demo: "https://heathergauthier2018.github.io/Washington-State-Project/", // updated
    repo: "",
    image: "thumbs/thumb-placeholder.jpg"
  },
  {
    title: "Dear Self — Journaling App (WIP)",
    description: "Personal journaling app focusing on clean UX, tags/search, and private local data. Case study + demo link coming soon.",
    tags: ["React","Routing","State","localStorage","Accessibility"],
    demo: "#",
    repo: "#",
    image: "thumbs/thumb-placeholder.jpg"
  }
];

(async function loadProjects(){
  let items = FALLBACK_ITEMS;
  try {
    const res = await fetch('projects.json?ts=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('projects.json HTTP ' + res.status);
    const data = await res.json();
    if (Array.isArray(data) && data.length) items = data;
  } catch(_) { /* keep fallback */ }
  render(items);
})();

function render(items){
  if (!grid) return;
  grid.innerHTML = '';
  const frag = document.createDocumentFragment();

  items.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'card';

    // per-card accent cycle (matches CSS --accent-1..5)
    const idx = (i % 5) + 1;
    card.style.setProperty('--card-accent', `var(--accent-${idx})`);

    const tagClass = (t) => {
      const k = String(t).toLowerCase();
      if (k === 'html') return '--html';
      if (k === 'css') return '--css';
      if (k === 'javascript' || k === 'js') return '--js';
      if (k === 'react') return '--react';
      if (k === 'angular') return '--angular';
      if (k === 'typescript' || k === 'ts') return '--ts';
      if (k === 'api') return '--api';
      if (k === 'svg') return '--svg';
      if (k === 'accessibility' || k === 'a11y') return '--a11y';
      if (k === 'routing') return '--routing';
      if (k === 'localstorage' || k === 'storage') return '--storage';
      if (k === 'responsive') return '--responsive';
      return '';
    };

    const imgSrc = p.image || 'thumbs/thumb-placeholder.jpg';
    const hasDemo = !!(p.demo && p.demo !== '#');
    const hasRepo = !!(p.repo && p.repo !== '#');
    const isPrivate = hasDemo && !hasRepo;

    const tagsHtml =
      (p.tags || [])
        .map(t => `<span class="tag ${tagClass(t)}">${escapeHtml(t)}</span>`)
        .join('') +
      (isPrivate ? `<span class="tag">Private code</span>` : '');

    card.innerHTML = `
      <img class="thumb"
           src="${imgSrc}"
           alt="Screenshot of ${escapeHtml(p.title || 'project')}"
           onerror="this.onerror=null;this.src='thumbs/thumb-placeholder.jpg'">
      <div class="content">
        <h3 class="title">${escapeHtml(p.title)}</h3>
        <p class="desc">${escapeHtml(p.description || '')}</p>
        <div class="tags">${tagsHtml}</div>
        <div class="actions">
          ${hasDemo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noreferrer">Live Demo</a>` : ''}
          ${hasRepo ? `<a class="btn" href="${p.repo}" target="_blank" rel="noreferrer">Repo</a>` : ''}
        </div>
      </div>
    `;
    frag.appendChild(card);
  });

  grid.appendChild(frag);
}

function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
