"use strict";

let htmCode = document.querySelector("#html-editor");
let cssCode = document.querySelector("#css-editor");
let jsCode = document.querySelector("#js-editor");

let output = document.querySelector("#output");

ace.edit(htmCode, {
  theme: "ace/theme/twilight",
  mode: "ace/mode/html",
});
ace.edit(cssCode, {
  theme: "ace/theme/cobalt",
  mode: "ace/mode/css",
});

ace.edit(jsCode, {
  theme: "ace/theme/monokai",
  mode: "ace/mode/javascript",
});

var htmlEditor = ace.edit("html-editor");
var cssEditor = ace.edit("css-editor");
var jsEditor = ace.edit("js-editor");

document.addEventListener("keyup", function () {
    //console.log(htmlEditor.getValue());

  let markup2 =
    htmlEditor.getValue() + "<style>" + cssEditor.getValue() + "</style>";

  output.contentDocument.body.innerHTML = markup2;
  output.contentWindow.eval(jsEditor.getValue());
});