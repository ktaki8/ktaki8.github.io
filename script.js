// Portfolio JS: year, profile links, projects from JSON + filters + debug
alert("NEW SCRIPT LOADED");
const YEAR = document.getElementById("year");
if (YEAR) YEAR.textContent = new Date().getFullYear();

const LINKS = {
  linkedin: "https://www.linkedin.com/in/khadijatakicyber",
  github: "https://github.com/ktaki8",
  resume: "resume.pdf"
};

const linkedinLink = document.getElementById("linkedinLink");
const githubLink = document.getElementById("githubLink");
const resumeLink = document.getElementById("resumeLink");

if (linkedinLink) linkedinLink.href = LINKS.linkedin;
if (githubLink) githubLink.href = LINKS.github;
if (resumeLink){
  resumeLink.href = LINKS.resume;
  resumeLink.target = "_blank";
  resumeLink.rel = "noreferrer";
}

const grid = document.getElementById("projectGrid");
const chips = Array.from(document.querySelectorAll(".chip"));

let allProjects = [];
let activeFilter = "all";

// Builds a URL that works on GitHub Pages for both internal + external links
function buildHref(raw){
  const href = (raw || "").trim();
  if (!href) return "";

  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  if (isExternal) return href;

  // Internal: resolve relative to the current folder of index.html
  // This handles repo base paths automatically.
  return new URL(href.replace(/^\.?\//, ""), window.location.href).toString();
}

function showErrorOnPage(msg){
  if (!grid) return;
  grid.innerHTML = `
    <div class="project" style="border:1px solid rgba(255,0,0,.35);">
      <div class="projectTop">
        <h3>Projects failed to load</h3>
      </div>
      <p style="opacity:.9">${msg}</p>
      <p style="opacity:.75">Open your browser console to see details.</p>
    </div>
  `;
}

function renderProjects(){
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = allProjects.filter(p => {
    if (activeFilter === "all") return true;
    return (p.tags || []).includes(activeFilter);
  });

  filtered.forEach(p => {
    const hrefRaw = (p.link || "").trim();
    const href = buildHref(hrefRaw);

    const card = href ? document.createElement("a") : document.createElement("div");
    card.className = "project";

    if (href){
      card.href = href;

      const isExternal = hrefRaw.startsWith("http://") || hrefRaw.startsWith("https://");
      if (isExternal){
        card.target = "_blank";
        card.rel = "noreferrer";
      }
    }

    const top = document.createElement("div");
    top.className = "projectTop";

    const title = document.createElement("h3");
    title.textContent = p.title || "Untitled";

    const badges = document.createElement("div");
    badges.className = "badges";

    (p.badges || []).slice(0,3).forEach(b => {
      const bd = document.createElement("span");
      bd.className = "badge" + (String(b).toLowerCase().includes("current") ? " hot" : "");
      bd.textContent = b;
      badges.appendChild(bd);
    });

    top.appendChild(title);
    top.appendChild(badges);

    const desc = document.createElement("p");
    desc.textContent = p.description || "";

    card.appendChild(top);
    card.appendChild(desc);

    grid.appendChild(card);
  });
}

async function loadProjects(){
  try{
    const jsonUrl = new URL("projects.json", window.location.href).toString();
    const res = await fetch(jsonUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`projects.json request failed (${res.status})`);

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("projects.json must be an array");

    allProjects = data;
    renderProjects();
  } catch(e){
    console.error(e);
    showErrorOnPage(String(e.message || e));
  }
}

chips.forEach(btn => {
  btn.addEventListener("click", () => {
    chips.forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter || "all";
    renderProjects();
  });
});

loadProjects();
