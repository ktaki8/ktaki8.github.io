// Minimal JS: year, link wiring, project grid + filters

const YEAR = document.getElementById("year");
if (YEAR) YEAR.textContent = new Date().getFullYear();

// Profile links
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

function renderProjects(){

  if (!grid) return;

  grid.innerHTML = "";

  const filtered = allProjects.filter(p => {
    if (activeFilter === "all") return true;
    return (p.tags || []).includes(activeFilter);
  });

  filtered.forEach(p => {

    const card = document.createElement("div");
    card.className = "project";

    const top = document.createElement("div");
    top.className = "projectTop";

    const title = document.createElement("h3");
    title.textContent = p.title || "Untitled";

    const badges = document.createElement("div");
    badges.className = "badges";

    (p.badges || []).slice(0,3).forEach(b => {

      const bd = document.createElement("span");
      bd.className = "badge" + (b.toLowerCase().includes("current") ? " hot" : "");
      bd.textContent = b;

      badges.appendChild(bd);

    });

    top.appendChild(title);
    top.appendChild(badges);

    const desc = document.createElement("p");
    desc.textContent = p.description || "";

    const links = document.createElement("div");
    links.className = "projectLinks";

    // PROJECT LINK
    if (p.link){

      const a = document.createElement("a");

      const href = (p.link || "").trim();

      const isExternal =
        href.startsWith("http://") ||
        href.startsWith("https://");

      if (isExternal){
        a.href = href;
        a.target = "_blank";
        a.rel = "noreferrer";
      } else {
        // ensure GitHub Pages resolves correctly
        a.href = `./${href.replace(/^\.?\//, "")}`;
      }

      a.textContent = "Project";

      links.appendChild(a);
    }

    // REPO LINK
    if (p.repo){

      const a = document.createElement("a");

      a.href = p.repo;
      a.target = "_blank";
      a.rel = "noreferrer";

      a.textContent = "Repo";

      links.appendChild(a);
    }

    // WRITEUP LINK
    if (p.writeup){

      const a = document.createElement("a");

      a.href = p.writeup;
      a.target = "_blank";
      a.rel = "noreferrer";

      a.textContent = "Write-up";

      links.appendChild(a);
    }

    card.appendChild(top);
    card.appendChild(desc);
    card.appendChild(links);

    grid.appendChild(card);

  });
}

async function loadProjects(){

  try{

    // IMPORTANT: ./ ensures GitHub Pages loads correctly
    const res = await fetch("./projects.json", { cache: "no-store" });

    if (!res.ok) throw new Error("projects.json not found");

    allProjects = await res.json();

  } catch(e){

    console.warn("Could not load projects.json, using fallback");

    allProjects = [
      {
        title: "BreachGuard",
        description: "Privacy-first password risk engine using breach analysis and entropy modeling.",
        tags: ["detection","ai-privacy"],
        badges: ["Python","Flask"]
      },
      {
        title: "LA28 Olympics Tabletop Exercise",
        description: "Cyber crisis tabletop focused on coordinated response and infrastructure resilience.",
        tags: ["policy","threat-intel"],
        badges: ["Tabletop"]
      },
      {
        title: "SILENTFALL",
        description: "Threat intelligence and detection engineering research.",
        tags: ["threat-intel","detection"],
        badges: ["Current focus"]
      }
    ];
  }

  renderProjects();
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
