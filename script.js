const grid = document.getElementById('grid');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

document.getElementById('ghLink').href = 'https://github.com/heathergauthier2018';
document.getElementById('liLink').href = 'https://www.linkedin.com/in/heather-gauthier-11903a2a3/';

async function loadProjects() {
  try {
    const RES_VER = 'v6'; // bump to bust cache
    const res = await fetch(`projects.json?${RES_VER}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load projects.json');

    let items = await res.json();

    // Ensure D277 appears even if remote JSON hasn’t updated yet
    const d277Demo = 'https://d277-front-end-web-development-b3bf51.gitlab.io/';
    const hasD277 = items.some(p =>
      /d277/i.test(p.title || '') || (p.demo || '').toLowerCase() === d277Demo.toLowerCase()
    );
    if (!hasD277) {
      items.push({
        title: 'D277 Front-End Web Development',
        description: 'Responsive multi-page site showing semantic HTML, modern CSS (Flexbox/Grid), and vanilla JS interactivity.',
        tags: ['HTML','CSS','JavaScript','Accessibility'],
        demo: d277Demo,
        repo: '',
        image: 'thumbs/d277.jpg' // or 'thumbs/thumb-placeholder.jpg' until you add a screenshot
      });
    }

    render(items);
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p style="color:#9ca3af">Could not load projects. Make sure projects.json exists.</p>';
  }
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
