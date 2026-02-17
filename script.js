// Minimal JS: year, link wiring, project grid + filters

const YEAR = document.getElementById("year");
if (YEAR) YEAR.textContent = new Date().getFullYear();

// Update these if you want (or keep as-is)
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

    (p.badges || []).slice(0, 3).forEach(b => {
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

    if (p.link){
      const a = document.createElement("a");
      a.href = p.link;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = "Project";
      links.appendChild(a);
    }
    if (p.repo){
      const a = document.createElement("a");
      a.href = p.repo;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = "Repo";
      links.appendChild(a);
    }
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
    const res = await fetch("projects.json", { cache: "no-store" });
    if (!res.ok) throw new Error("projects.json not found");
    allProjects = await res.json();
  } catch(e){
    // Fallback if projects.json isn’t there yet
    allProjects = [
      {
        title: "BreachGuard: Password Aggregator & Policy Analyzer",
        description: "Privacy-first password risk engine: k-anonymity breach checks, entropy modeling, pattern heuristics, and blacklist vetting.",
        tags: ["detection","ai-privacy"],
        badges: ["Python", "Flask"],
        repo: ""
      },
      {
        title: "LA28 Olympics Tabletop Exercise",
        description: "Critical infrastructure cyber scenario focused on coordinated response, public-private decision-making, and risk under uncertainty.",
        tags: ["policy","threat-intel"],
        badges: ["Tabletop", "Critical Infrastructure"],
        link: ""
      },
      {
        title: "SILENTFALL: CTI + detection engineering repo",
        description: "Threat intel and defensive research repo focused on zero-click risk, spyware tradecraft, and detection-ready outputs.",
        tags: ["threat-intel","detection"],
        badges: ["Current focus"],
        repo: ""
      }
    ];
  } finally{
    renderProjects();
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
