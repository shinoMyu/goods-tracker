// document.addEventListener("DOMContentLoaded", () => {
//     const colorMap = {
//       "さらざんまい": "#f6c1cc",
//       "ナカノヒトゲノム": "#b6e3c6",
//       "其他作品": "#cfd8dc"
//     };
  
//     document.querySelectorAll(".work-color").forEach(el => {
//       const work = el.dataset.work;
//       el.style.backgroundColor = colorMap[work] ?? "#eee";
//     });
//   });

document.addEventListener("DOMContentLoaded", () => {
  const colorPool = [
    "#e57373", "#64b5f6", "#81c784",
    "#ba68c8", "#ffb74d", "#4db6ac",
    "#9575cd", "#f4a261", "#2a9d8f",
    "#e76f51", "#457b9d", "#8d99ae"
  ];

  const workColorMap = {};
  let colorIndex = 0;

  document.querySelectorAll(".work-color").forEach(cell => {
    const work = cell.dataset.work || "unknown";

    if (!workColorMap[work]) {
      workColorMap[work] = colorPool[colorIndex % colorPool.length];
      colorIndex++;
    }

    cell.style.backgroundColor = workColorMap[work];
  });
});