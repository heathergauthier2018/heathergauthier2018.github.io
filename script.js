const grid = document.getElementById('grid');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

document.getElementById('ghLink').href = 'https://github.com/heathergauthier2018';
document.getElementById('liLink').href = 'https://www.linkedin.com/in/heather-gauthier-11903a2a3/';

const RES_VER = 'v8'; // bump to bust cache

// Built-in fallback so the page works even if projects.json isn't loading yet
const FALLBACK_ITEMS = [
  {
    title: "Cocktail Studio (Random + Search)",
    description: "Single-page app combining a random generator with a search explorer. Favorites saved in localStorage.",
    tags: ["HTML", "CSS", "JavaScript", "API"],
    demo: "https://heathergauthier2018.github.io/cocktail-finder/",
    repo: "https://github.com/heathergauthier2018/cocktail-finder",
    image: "thumbs/random-cocktail.jpg"
  },
  {
    title: "World Map (Angular, Course Project)",
    description: "Interactive SVG world map in Angular with country details from the World Bank API.",
    tags: ["Angular", "Routing", "HTTPClient", "API"],
    demo: "#", // button will be hidden until you have a real link
    repo: "#",
    image: "thumbs/world-map.jpg"
  },
  {
    title: "D277 Front-End Web Development",
    description: "Responsive multi-page site showing semantic HTML, modern CSS (Flexbox/Grid), and vanilla JS interactivity.",
    tags: ["HTML", "CSS", "JavaScript", "Accessibility"],
    demo: "https://d277-front-end-web-development-b3bf51.gitlab.io/",
    repo: "",
    image: "thumbs/thumb-placeholder.jpg" // swap to thumbs/d277.jpg when you have it
  }
];

async function loadProjects() {
  let items = FALLBACK_ITEMS;
  try {
    const res = await fetch(`projects.json?${RES_VER}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`projects.json HTTP ${res.status}`);
    const data = await res.json();               // could throw if JSON invalid
    if (Array.isArray(data) && data.length) {
      items = data;
    }
  } catch (err) {
    console.warn('Falling back to built-in projects because projects.json failed:', err);
    // (We still render FALLBACK_ITEMS)
  }
  render(items);
}

function render(items) {
  grid.innerHTML = '';
  const frag = document.createDocumentFragment();

  items.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';

    const imgSrc = p.image || 'thumbs/thumb-placeholder.jpg';
    const hasDemo = !!(p.demo && p.demo !== '#');
    const hasRepo = !!(p.repo && p.repo !== '#');

    card.innerHTML = `
      <img class="thumb"
           src="${imgSrc}"
           alt="Screenshot of ${escapeHtml(p.title || 'project')}"
           onerror="this.onerror=null;this.src='thumbs/thumb-placeholder.jpg'">
      <div class="content">
        <h3 class="title">${escapeHtml(p.title)}</h3>
        <p class="desc">${escapeHtml(p.description || '')}</p>
        <div class="tags">${(p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
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

function escapeHtml(str) {
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}

loadProjects();
