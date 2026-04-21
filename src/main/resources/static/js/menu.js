const moreBtn = document.getElementById("moreBtn");
const menu = document.getElementById("menu");
const mergeModeBtn = document.getElementById("mergeModeBtn");
const dropdown = document.querySelector(".dropdown");

moreBtn.addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !moreBtn.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

mergeModeBtn.onclick = () => {
  startMergeMode();
  dropdown.classList.remove("open");
};