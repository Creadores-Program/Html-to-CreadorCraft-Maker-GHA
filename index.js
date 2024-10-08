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
  var Packager = require("@turbowarp/packager");
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
    let $ = cheerio.load(htms);
    let jsFileCache = "";
    $("body").append("<pprojr>"+$("script[type='p4-project']").html()+"</pprojr>");
    jsFileCache += "$('body').append(`<script type='p4-project'>`+$(`pprojr`).html()+`</script>`);\n$('pprojs').remove();\n";
    $("script").each(function(){
      if($(this).attr("type") == "p4-project"){
        return;
      }
      jsFileCache += $(this).html() + "\n";
      $(this).remove();
    });
    let cssFileCache = "";
    $("style").each(function(){
      cssFileCache += $(this).html() + "\n";
      $(this).remove();
    });
    fs.writeFileSync(dirGame+"/main.js", jsFileCache);
    fs.writeFileSync(dirGame+"/index.css", cssFileCache);
    fs.writeFileSync(dirGame+"/index.html", $.html());
    console.info(prefix+"Done!");
    console.info(prefix+"Saved Your project in "+dirGame+"/*");
  }
  async function processStoH(progetD){
    let callbacK = (type, a, b)=> {};
    let loadProject = await Packager.loadProject(progetD, callbacK);
    let packager = new Packager.Packager();
    packager.project = loadProject;
    if(core.getInput("pathCustomJs") != ""){
      packager.options.custom.js = fs.readFileSync(core.getInput("pathCustomJs"));
    }
    if(core.getInput("pathCustomCSS") != ""){
      packager.options.custom.css = fs.readFileSync(core.getInput("pathCustomCSS"));
    }
    if(core.getInput("enableGamepad") != "" && core.getInput("enableGamepad")){
      packager.options.chunks.gamepad = true;
    }
    let resultPre = await packager.package();
    convertCCG(resultPre.data);
  }
  (async function (){
    console.info(prefix+"Convert Scratch Game to HTML...");
    let DataSG;
    if(core.getInput("id") != ""){
      scratchG = core.getInput("id");
      let Dat = await (await fetch("https://trampoline.turbowarp.org/api/projects/"+scratchG)).json();
      let token = Dat.project_token;
      processStoH(await (await fetch("https://projects.scratch.mit.edu/"+scratchG+"?token="+token)).arrayBuffer());
      return;
    }
    if(core.getInput("url") != ""){
      scratchG = core.getInput("url");
      DataSG = await (await fetch(scratchG)).arrayBuffer();
      processStoH(DataSG);
      return;
    }
    if(core.getInput("pathGame") != ""){
      scratchG = core.getInput("pathGame");
      processStoH(fs.readFileSync(scratchG));
      return;
    }
    throw new Error(prefix+"You need to specify URL, ID or Scratch 3 file to convert!");
  })();
}catch(error){
    console.error(error.message);
    core.setFailed(error.message);
}
