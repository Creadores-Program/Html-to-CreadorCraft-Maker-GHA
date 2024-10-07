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
  var Htmlifier;
  (async function(){ Htmlifier = await import("@sheeptester/htmlifier"); })();
  var fs = require("fs");
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
  (async function(){
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
  })();
  var manifestCCG = {};
  fs.readFile(dirGame+"/manifest.json", 'utf8', (err, data) => {
    if(err){
        throw err;
    }
    manifestCCG = JSON.parse(data);
    if(manifestCCG.name == null || manifestCCG.name.trim() == ""){
        throw new Error(prefix+"You need a name for the game!"+errorMessages.inManifest);
    }
    if(manifestCCG.version == null || manifestCCG.version.trim() == ""){
        throw new Error(prefix+"You need a version for the game!"+errorMessages.inManifest);
    }
    if(manifestCCG.description == null){
        throw new Error(prefix+"You need a description for the game!"+errorMessages.inManifest);
    }
    if(((manifestCCG.description.trim().toLowerCase().indexOf("<script") != -1 || manifestCCG.description.trim().toLowerCase().indexOf("</script") != -1) || (manifestCCG.name.trim().toLowerCase().indexOf("<script") != -1 || manifestCCG.name.trim().toLowerCase().indexOf("</script") != -1)) || (manifestCCG.version.trim().toLowerCase().indexOf("<script") != -1 || manifestCCG.version.trim().toLowerCase().indexOf("</script") != -1)){
      throw new Error(prefix+"Name, Version or Description Invalid!"+errorMessages.inManifest);
    }
    if(manifestCCG.mainHtml == null){
        throw new Error(prefix+"You need a main Html for the game!"+errorMessages.inManifest);
    }
    if(manifestCCG.mainJS == null){
        throw new Error(prefix+"You need a main JS for the game!"+errorMessages.inManifest);
    }
    function VerifyAccess(dirs) {
      if(!fs.existsSync(dirGame+"/"+dirs)){
        throw new Error(prefix+errorMessages.inFileNotFound(dirs));
      }
    }
    VerifyAccess(manifestCCG.mainHtml);
    VerifyAccess(manifestCCG.mainJS);
    if(manifestCCG.mainJSmodule != null) VerifyAccess(manifestCCG.mainJSmodule);
    if(manifestCCG.mainCSS != null) VerifyAccess(manifestCCG.mainCSS);
    if(manifestCCG.mainPython != null) VerifyAccess(manifestCCG.mainPython);
    if(manifestCCG.mainWebAssembly != null) VerifyAccess(manifestCCG.mainWebAssembly);
    if(manifestCCG.mainCoffeeScript != null) VerifyAccess(manifestCCG.mainCoffeeScript);
    if(manifestCCG.mainLS != null) VerifyAccess(manifestCCG.mainLS);
    if(manifestCCG.mainTS != null) VerifyAccess(manifestCCG.mainTS);
    if(manifestCCG.mainLatinoScript != null) VerifyAccess(manifestCCG.mainLatinoScript);
    if(manifestCCG.mainSCSS != null) VerifyAccess(manifestCCG.mainSCSS);
    if(manifestCCG.mainPerl != null) VerifyAccess(manifestCCG.mainPerl);
    if(manifestCCG.mainRuby != null) VerifyAccess(manifestCCG.mainRuby);
    if(manifestCCG.mainLua != null) VerifyAccess(manifestCCG.mainLua);
    if(manifestCCG.mainPHP != null) VerifyAccess(manifestCCG.mainPHP);
    if(manifestCCG.mainLat != null) VerifyAccess(manifestCCG.mainLat);
    console.info(prefix+"Verification Complete");
    console.info(prefix+"Packing...");
    function zipDirectory(sourceDir, outPath) {
      const output = fs.createWriteStream(outPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
    
      output.on('close', () => {
        console.info(prefix+"Game "+manifestCCG.name+" "+manifestCCG.version+".creadorcraftgame.zip Build Correctly in "+outPath);
      });
    
      archive.on('error', (err) => {
        console.error(prefix+"Game "+manifestCCG.name+" "+manifestCCG.version+".creadorcraftgame.zip Build Fail");
        throw err;
      });
    
      archive.pipe(output);
      archive.directory(sourceDir, false);

  archive.finalize();
}

  const sourceDir = dirGame;
  if(!fs.existsSync("./gameBuildCCM")){
    fs.mkdirSync("./gameBuildCCM");
  }
  const outPath = "./gameBuildCCM/"+manifestCCG.name+" "+manifestCCG.version+".creadorcraftgame.zip";

  zipDirectory(sourceDir, outPath);
  });
}catch(error){
    console.error(error.message);
    core.setFailed(error.message);
}
