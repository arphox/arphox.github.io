"use strict";

(() => {
  if (typeof qrcodegen === "undefined") return;

  const get = (id) => document.getElementById(`qr-${id}`);
  const text = get("text");
  const preview = get("preview");
  const download = get("download");
  let downloadUrl;

  function integer(id, min, max) {
    const input = get(id);
    const value = input.valueAsNumber;
    if (!Number.isInteger(value) || value < min || value > max) {
      throw new Error(`${input.parentElement.firstChild.textContent.trim()} must be a whole number from ${min} to ${max}.`);
    }
    return value;
  }

  function redraw() {
    // Discard the old image and link before validation, so an error never leaves
    // a downloadable QR for the previous input.
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = undefined;
    download.removeAttribute("href");
    download.hidden = true;
    preview.hidden = true;
    preview.replaceChildren();
    get("error").hidden = true;
    get("statistics").textContent = "";
    get("empty").hidden = text.value.length !== 0;
    const bitmap = get("format").value === "png";
    get("scale-label").hidden = !bitmap;
    if (text.value.length === 0) return;

    try {
      const border = integer("border", 0, 100);
      const minVersion = integer("version-min", 1, 40);
      const maxVersion = integer("version-max", 1, 40);
      if (minVersion > maxVersion) throw new Error("Minimum version must not exceed maximum version.");
      const light = get("light").value;
      const dark = get("dark").value;
      if (![light, dark].every((color) => /^#[0-9a-f]{6}$/i.test(color))) {
        throw new Error("Choose valid light and dark colors.");
      }
      const segments = qrcodegen.QrSegment.makeSegments(text.value);
      let qr;
      try {
        qr = qrcodegen.QrCode.encodeSegments(
          segments, qrcodegen.QrCode.Ecc[get("ecc").value],
          minVersion, maxVersion, Number(get("mask").value), get("boost").checked
        );
      } catch (error) {
        if (error instanceof RangeError) {
          throw new Error("This text does not fit the selected QR version range and error correction. Shorten it or increase the maximum version.");
        }
        throw error;
      }

      const size = qr.size + border * 2;
      let dimensions;
      if (bitmap) {
        const scale = integer("scale", 1, 30);
        const pixels = size * scale;
        if (pixels > 4096) throw new Error("PNG exceeds 4096 × 4096 pixels. Reduce scale or border, or choose SVG.");
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = pixels;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is unavailable in this browser. Try SVG output.");
        context.fillStyle = light;
        context.fillRect(0, 0, pixels, pixels);
        context.fillStyle = dark;
        for (let y = 0; y < qr.size; y++) {
          for (let x = 0; x < qr.size; x++) {
            if (qr.getModule(x, y)) context.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
          }
        }
        download.href = canvas.toDataURL("image/png");
        preview.append(canvas);
        dimensions = `${pixels} × ${pixels} pixels`;
      } else {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
        svg.setAttribute("width", size * 8);
        svg.setAttribute("height", size * 8);
        svg.setAttribute("shape-rendering", "crispEdges");
        const background = document.createElementNS(ns, "rect");
        background.setAttribute("width", "100%");
        background.setAttribute("height", "100%");
        background.setAttribute("fill", light);
        const path = document.createElementNS(ns, "path");
        const modules = [];
        for (let y = 0; y < qr.size; y++) {
          for (let x = 0; x < qr.size; x++) {
            if (qr.getModule(x, y)) modules.push(`M${x + border},${y + border}h1v1h-1z`);
          }
        }
        path.setAttribute("d", modules.join(" "));
        path.setAttribute("fill", dark);
        svg.append(background, path);
        const source = new XMLSerializer().serializeToString(svg);
        downloadUrl = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
        download.href = downloadUrl;
        preview.append(svg);
        dimensions = "scalable vector";
      }
      const level = Object.entries(qrcodegen.QrCode.Ecc).find(([, value]) => value === qr.errorCorrectionLevel)[0];
      get("statistics").textContent = `Version ${qr.version} · ${qr.size} × ${qr.size} modules · ECC ${level.toLowerCase()} · mask ${qr.mask} · ${dimensions}`;
      preview.hidden = false;
      download.download = `qr-code.${bitmap ? "png" : "svg"}`;
      download.textContent = `Download ${bitmap ? "PNG" : "SVG"}`;
      download.hidden = false;
    } catch (error) {
      get("error").textContent = error instanceof Error ? error.message : "Could not generate this QR code. Check your settings.";
      get("error").hidden = false;
    }
  }

  for (const input of document.querySelectorAll(".qr-controls input, .qr-controls select, .qr-controls textarea")) {
    input.addEventListener("input", redraw);
  }
  get("clear").addEventListener("click", () => {
    text.value = "";
    redraw();
    text.focus();
  });
  get("loading").hidden = true;
  get("tool").hidden = false;
  redraw();
})();
