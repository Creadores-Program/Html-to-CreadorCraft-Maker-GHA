const prefix = "[Html CreadorCraft Maker] ";
console.info(prefix+"Html CreadorCraft Maker Action by Creadores Program ©2024");
console.info(prefix+"Loading Libraries...");
try{
  const { execSync } = require("child_process");
  let rute = __dirname.replaceAll("\\", "/")+"/";
  execSync("npm install", { stdio: "inherit", cwd: rute });
  var core = require('@actions/core');
  var github = require('@actions/github');
  var cheerio = require('cheerio');
  var fs = require("fs");
}catch(error){
  console.error(error.stack || error.message);
  core.setFailed(error.stack || error.message);
}
console.info(prefix+"Done!");
console.info(prefix+"Creating CreatorCraft Game...");
var dirGameDes = core.getInput("path");
var dirGame = core.getInput("pathGame");
try{
  function convertCCG(htms){
    console.info(prefix+"Convert Html to Game by CreatorCraft...");
    let $ = cheerio.load(htms);
    let jsFileCache = "";
    if(fs.existsSync(dirGame+"/manifest.json")){
      let manifestG = JSON.parse(fs.readFileSync(dirGame+"/manifest.json", "utf8"));
      $("link").each(function(){
        if(manifestG.importCSSMap == null){
          manifestG.importCSSMap = [];
        }
        let tagL = {};
        for(let attrName in this.attribs){
          tagL[attrName] = this.attribs[attrName];
        }
        manifestG.importCSSMap.push(tagL);
      });
    }
    $("script").each(function(){
      if($(this).attr("src") != null){
        jsFileCache += "$.getScript("+JSON.stringify($(this).attr("src"))+", function(){\n";
      }
      jsFileCache += $(this).html() + "\n";
      if($(this).attr("src") != null){
        jsFileCache += "});\n";
      }
      $(this).remove();
    });
    if(core.getInput("pathCustomJs") != null && core.getInput("pathCustomJs").trim() != ""){
      jsFileCache += fs.readFileSync(core.getInput("pathCustomJs"));
    }
    let cssFileCache = "";
    $("style").each(function(){
      cssFileCache += $(this).html() + "\n";
      $(this).remove();
    });
    if(core.getInput("pathCustomCSS") != null && core.getInput("pathCustomCSS").trim() != ""){
      cssFileCache += fs.readFileSync(core.getInput("pathCustomCSS"));
    }
    fs.writeFileSync(dirGameDes+"/main.js", jsFileCache);
    fs.writeFileSync(dirGameDes+"/index.css", cssFileCache);
    fs.writeFileSync(dirGameDes+"/index.html", $.html());
    console.info(prefix+"Done!");
    console.info(prefix+"Saved Your project in "+dirGameDes+"/*");
  }
  convertCCG(fs.readFileSync(dirGame));
}catch(error){
    console.error(error.message);
    core.setFailed(error.message);
}
