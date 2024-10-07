const prefix = "[Scratch CreadorCraft Maker] ";
console.info(prefix+"Scratch CreadorCraft Maker Action by Creadores Program ©2024");
console.info(prefix+"Loading Libraries...");
try{
  const { execSync } = require("child_process");
  let rute = __dirname.replaceAll("\\", "/")+"/";
  execSync("npm install", { stdio: "inherit", cwd: rute });
  var core = require('@actions/core');
  var github = require('@actions/github');
  var cheerio = require('cheerio');
  var fs = require("fs");
  var Htmlifier;
}catch(error){
  console.error(error.stack || error.message);
  core.setFailed(error.stack || error.message);
}
//error Messages
const errorMessages = {
    inManifest: "\nError in manifest.json",
    inFileNotFound: function(file){
      return "\nError "+file+" Not Found";
    }
};
console.info(prefix+"Done!");
console.info(prefix+"Creating CreatorCraft Game...");
var dirGame = core.getInput("path");
try{
  var scratchG;
  function convertCCG(htms){
    console.info(prefix+"Convert Html to Game by CreatorCraft...");
    console.info(htms);
  }
  async function ScratchCCG(){
    console.info(prefix+"Convert Scratch Game to HTML...");
    let html;
    if(core.getInput("id") != null){
      scratchG = core.getInput("id");
      html = await new Htmlifier()
        .htmlify({ type: "id", id: scratchG })
        .then(blob => blob.text());
      convertCCG(html);
      return;
    }
    if(core.getInput("url") != null){
      scratchG = core.getInput("url");
      fetch(scratchG)
        .then(r => r.blob())
        .then(blob => new Htmlifier().htmlify({ type: "file", file: blob }))
        .then(blob => blob.text())
        .then(convertCCG);
      return;
    }
    if(core.getInput("pathGame") != null){
      scratchG = core.getInput("pathGame");
      let fromF = require("fetch-blob/from.js");
      html = await new Htmlifier()
        .htmlify({ type: "file", file: await fromF(scratchG) })
        .then(blob => blob.text());
      convertCCG(html);
      return;
    }
    throw new Error(prefix+"You need to specify URL, ID or Scratch 3 file to convert!");
  }
  (async function(){ Htmlifier = await import("@sheeptester/htmlifier"); Htmlifier = Htmlifier.default; ScratchCCG(); })();
}catch(error){
    console.error(error.message);
    core.setFailed(error.message);
}
