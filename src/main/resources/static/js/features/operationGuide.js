let currentLang = "zh";

const guideModal = document.getElementById("guideModal");
const guideTitle = document.getElementById("guideTitle");
const guideContent = document.getElementById("guideContent");
const guideBtn = document.getElementById("guideBtn");
const guideClose = document.getElementById("guideClose");
const langBtns = document.querySelectorAll(".guide-lang [data-lang]");

function renderGuide() {
  const data = operationGuideData[currentLang];

  guideTitle.textContent = data.title;

  guideContent.innerHTML = data.sections.map(section => `
    <details>
      <summary>${section.title}</summary>
      ${section.intro ? `<p class="guide-intro">${section.intro}</p>` : ""}
      ${section.groups.map(group => `
        <div class="guide-group">
          <h4>${group.title}</h4>
          <ul>
            ${group.items.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    </details>
  `).join("");

  langBtns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });

  guideModal.querySelector(".guide-box").classList.toggle("lang-ja", currentLang === "ja");
}

function openGuide() {
  guideModal.classList.remove("hidden");
}

function closeGuide() {
  guideModal.classList.add("hidden");
}

langBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.dataset.lang;
    renderGuide();
  });
});

if (guideBtn) guideBtn.addEventListener("click", openGuide);
if (guideClose) guideClose.addEventListener("click", closeGuide);
if (guideModal) guideModal.addEventListener("click", e => {
  if (e.target === guideModal) closeGuide();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !guideModal.classList.contains("hidden")) closeGuide();
});

renderGuide();
