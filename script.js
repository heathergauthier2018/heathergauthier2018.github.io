const grid = document.getElementById('grid');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

document.getElementById('ghLink').href = 'https://github.com/heathergauthier2018';
document.getElementById('liLink').href = 'https://www.linkedin.com/in/heather-gauthier-11903a2a3/';

async function loadProjects(){
  try{
    const RES_VER = 'v2'; // bump this when projects.json changes
const res = await fetch(`projects.json?${RES_VER}`);
    if(!res.ok) throw new Error('Failed to load projects.json');
    const items = await res.json();
    render(items);
  }catch(err){
    console.error(err);
    grid.innerHTML = '<p style="color:#9ca3af">Could not load projects. Make sure projects.json exists.</p>';
  }
}

function render(items){
  grid.innerHTML = '';
  const frag = document.createDocumentFragment();
  items.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="thumb" src="${p.image || 'thumb-placeholder.jpg'}" alt="">
      <div class="content">
        <h3 class="title">${p.title}</h3>
        <p class="desc">${p.description || ''}</p>
        <div class="tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="actions">
          ${p.demo ? `<a class="btn" href="${p.demo}" target="_blank" rel="noreferrer">Live Demo</a>` : ''}
          ${p.repo ? `<a class="btn" href="${p.repo}" target="_blank" rel="noreferrer">Repo</a>` : ''}
        </div>
      </div>
    `;
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

loadProjects();
