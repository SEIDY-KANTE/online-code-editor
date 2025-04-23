"use strict";

// ========== ELEMENT REFERENCES ==========

const htmlEditorEl = document.querySelector("#html-editor");
const cssEditorEl = document.querySelector("#css-editor");
const jsEditorEl = document.querySelector("#js-editor");
const output = document.querySelector("#output");

const resizer = document.getElementById("dragMe");
const leftPane = document.querySelector(".left");
const rightPane = document.querySelector(".right");
const container = document.querySelector(".container");

const downloadBtn = document.getElementById("downloadBtn");
const themeSelector = document.getElementById("themeSelector");
const beautifyBtn = document.getElementById("beautifyBtn");
const toggleModeBtn = document.getElementById("toggleMode");

// ========== INIT ==========

let isDragging = false;

let htmlEditor = ace.edit(htmlEditorEl, {
  theme: "ace/theme/twilight",
  mode: "ace/mode/html",
});
let cssEditor = ace.edit(cssEditorEl, {
  theme: "ace/theme/cobalt",
  mode: "ace/mode/css",
});
let jsEditor = ace.edit(jsEditorEl, {
  theme: "ace/theme/monokai",
  mode: "ace/mode/javascript",
});

// ========== FUNCTIONS ==========

function updateOutput() {
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();

  const fullCode = `${html}<style>${css}</style>`;
  output.contentDocument.body.innerHTML = fullCode;
  output.contentWindow.eval(js);
}

function saveCodeToLocalStorage() {
  localStorage.setItem("html", htmlEditor.getValue());
  localStorage.setItem("css", cssEditor.getValue());
  localStorage.setItem("js", jsEditor.getValue());
}

function loadSavedCode() {
  if (localStorage.getItem("html")) htmlEditor.setValue(localStorage.getItem("html"), -1);
  if (localStorage.getItem("css")) cssEditor.setValue(localStorage.getItem("css"), -1);
  if (localStorage.getItem("js")) jsEditor.setValue(localStorage.getItem("js"), -1);
}

function resizeHandler(e) {
  if (!isDragging) return;

  let containerOffsetLeft = container.offsetLeft;
  let pointerRelativeXpos = e.clientX - containerOffsetLeft;
  let leftWidth = (pointerRelativeXpos / container.offsetWidth) * 100;
  let rightWidth = 100 - leftWidth;

  leftPane.style.flexBasis = `${leftWidth}%`;
  rightPane.style.flexBasis = `${rightWidth}%`;
}

function setTheme(theme) {
  htmlEditor.setTheme(`ace/theme/${theme}`);
  cssEditor.setTheme(`ace/theme/${theme}`);
  jsEditor.setTheme(`ace/theme/${theme}`);
  themeSelector.value = theme;
  localStorage.setItem("ace-theme", theme);
}

function toggleMode(isLight) {
  document.body.classList.toggle("light-mode", isLight);
  const icon = document.getElementById("modeIcon");
  icon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
  localStorage.setItem("ui-mode", isLight ? "light" : "dark");
}

function beautifyCode() {
  const html = html_beautify(htmlEditor.getValue());
  const css = css_beautify(cssEditor.getValue());
  const js = js_beautify(jsEditor.getValue());

  htmlEditor.setValue(html, -1);
  cssEditor.setValue(css, -1);
  jsEditor.setValue(js, -1);

  updateOutput();
}

function downloadCodeAsZip() {
  const zip = new JSZip();
  zip.file("index.html", htmlEditor.getValue());
  zip.file("style.css", cssEditor.getValue());
  zip.file("script.js", jsEditor.getValue());

  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, "my-online-editor.zip");
  });
}

// ========== EVENT LISTENERS ==========

document.addEventListener("DOMContentLoaded", () => {
  // Load saved code
  loadSavedCode();
  updateOutput();

  // Load saved theme
  const savedTheme = localStorage.getItem("ace-theme");
  if (savedTheme) setTheme(savedTheme);

  // Load UI mode
  const savedMode = localStorage.getItem("ui-mode");
  toggleMode(savedMode === "light");

  // Set year dynamically
  document.getElementById("year").textContent = new Date().getFullYear();
});

// Keyup to update output and save code
document.addEventListener("keyup", () => {
  updateOutput();
  saveCodeToLocalStorage();
});

// Resizer
resizer.addEventListener("mousedown", () => {
  isDragging = true;
  document.body.style.cursor = "ew-resize";
});

document.addEventListener("mousemove", resizeHandler);
document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.cursor = "default";
});

// Theme selector
themeSelector.addEventListener("change", e => setTheme(e.target.value));

// Beautify
beautifyBtn.addEventListener("click", beautifyCode);

// Download ZIP
downloadBtn.addEventListener("click", downloadCodeAsZip);

// Light/Dark Mode Toggle
toggleModeBtn.addEventListener("click", () => {
  const isNowLight = !document.body.classList.contains("light-mode");
  toggleMode(isNowLight);
});
