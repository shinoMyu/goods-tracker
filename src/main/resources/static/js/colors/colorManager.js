function applyWorkColor(cell, overrideColor) {
    const color = overrideColor ?? cell.dataset.color;
    const received = cell.dataset.received === "true";
    if (color && received) {
        cell.style.background = color;
    } else {
        cell.style.background = "";
    }
}

function applyOrderColor(cell, color) {
    const mark = cell.querySelector(".shippingMark");
    if (mark) mark.style.color = color || "";
}

function registerColorFeature(config) {
  const {
    selector,
    idAttr,
    applyColor,
    apiPath,
    extraClickCheck = () => true,
    previewAll = false,
    confirmPos = "below"
  } = config;

  const getId = cell => cell.dataset[idAttr];
  const attrName = "data-" + idAttr.replace(/([A-Z])/g, '-$1').toLowerCase();
  const fullSelector = `${selector}[${attrName}]`;

  function applyToAll(id, color) {
    document.querySelectorAll(`${selector}[${attrName}='${id}']`).forEach(c => {
      applyColor(c, color);
    });
  }

  document.querySelectorAll(selector).forEach(cell => {
    const id = getId(cell);
    if (!id) return;
    const color = cell.dataset.color;
    if (color) applyToAll(id, color);
  });

  document.addEventListener("click", (e) => {
    const cell = e.target.closest(selector);
    if (!cell) return;
    const id = getId(cell);
    if (!id) return;
    if (cell.dataset.color) return;
    if (!extraClickCheck(cell)) return;

    showColorPicker(cell, (color) => {
      if (previewAll) {
        applyToAll(id, color);
      } else {
        applyColor(cell, color);
      }
      document.querySelectorAll(`${selector}[${attrName}='${id}']`).forEach(c => {
        c.dataset.pendingColor = color;
      });
    });
  });

  document.addEventListener("mouseover", (e) => {
    const cell = e.target.closest(selector);
    if (!cell) return;
    if (cell._confirmShown) return;
    const id = getId(cell);
    if (!id) return;
    if (!cell.dataset.pendingColor || cell.dataset.color) return;

    cell._confirmShown = true;
    showConfirm(cell, async () => {
      const color = cell.dataset.pendingColor;
      await api(apiPath(id), { color });

      applyToAll(id, color);

      document.querySelectorAll(`${selector}[${attrName}='${id}']`).forEach(c => {
        c.dataset.color = color;
        delete c.dataset.pendingColor;
        c._confirmShown = false;
        updateRowUI(c.closest("tr"));
      });
    }, confirmPos);

    setTimeout(() => { cell._confirmShown = false; }, 300);
  });
}

registerColorFeature({
  selector: ".work-color",
  idAttr: "workId",
  apiPath: id => `/work/${id}/color`,
  applyColor: applyWorkColor,
  confirmPos: "below"
});

registerColorFeature({
  selector: ".status",
  idAttr: "order",
  apiPath: id => `/orders/${id}/color`,
  applyColor: applyOrderColor,
  previewAll: true,
  confirmPos: "right"
});
