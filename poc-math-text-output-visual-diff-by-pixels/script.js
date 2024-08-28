const mathIds = ["math1", "math2"];

async function captureAndCompareVisuals(mathId, dom1, dom2) {
  const aCanvas = await html2canvas(dom1);
  const bCanvas = await html2canvas(dom2);
  const aCtx = aCanvas.getContext("2d");
  const bCtx = bCanvas.getContext("2d");
  const { width: w, height: h } = aCanvas;
  const diffCanvas = document.createElement("canvas");
  const diffDiv = document.getElementById(mathId + '_diff');
  diffDiv.appendChild(diffCanvas);
  diffCanvas.width = w;
  diffCanvas.height = h;
  const diffCtx = diffCanvas.getContext("2d");
  const diffImageData = diffCtx.createImageData(w, h);
  const mismatchedPixels = pixelmatch(
    aCtx.getImageData(0, 0, w, h).data,
    bCtx.getImageData(0, 0, bCanvas.width, bCanvas.height).data,
    diffImageData.data,
    w, h, { threshold: 0.1 }
  );
  diffCtx.putImageData(diffImageData, 0, 0);
  const mismatchP = document.createElement("p");
  mismatchP.textContent = "Mismatched pixels = " + mismatchedPixels;
  diffDiv.appendChild(mismatchP);
  const titleNode = document.getElementById(mathId + '_title');
  if (mismatchedPixels == 0) {
    titleNode.textContent += " (pass)";
  } else {
    titleNode.textContent += " (fail)";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  for (const id of mathIds) {
    const e1 = document.getElementById(id + '_1');
    const e2 = document.getElementById(id + '_2');
    for (const elem of [e1, e2]) {
      window.renderMathInElement(elem, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
      });
    }
    setTimeout(() => {
      captureAndCompareVisuals(id, e1, e2);
    }, 500);
  }
});