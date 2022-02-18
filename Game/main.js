// --- functions --- //
function csv_(datapath, num){
  const req = new XMLHttpRequest();
  req.addEventListener("load", (event) =>{
    const response = event.target.responseText;
    const dataString = response.split('\n');
    csvAll.length++;
    for(let i=0;i<dataString.length;i++){
      csvAll[num].push(dataString[i].split(','))
    }
    // console.log(csvList[num].name);
    for(let i=0;i<csvAll[num].length;i++){
      // console.log(csvAll[num][i][0] + " " + csvAll[num][i][1]);
    }
  });
  req.open('GET', datapath, true);
  req.send();
}
function generate_spell(read){
  let table = [];
  table.length = read.length;
  for(let i=0;i<table.length;i++){
    table[i] = [];
  }
  // one-sound
  for(let i=0;i<read.length;i++){
    if(read[i] in typing){
      for(let j=0;j<typing[read[i]].length;j++){
        table[i].push(typing[read[i]][j]);
      }
    }
    else console.log("error" + i);
  }
  // two-sound
  for(let i=0;i<read.length-1;i++){
    if(read[i] + read[i+1] in typing){
      for(let j=0;j<typing[read[i] + read[i+1]].length;j++){
        table[i].push(typing[read[i] + read[i+1]][j] + "|");
      }
    }
    else continue;
  }
  return table;
}
// --- definition --- //
let stpwtch;
let dat_now;
let csvList;
let csvAll = [[]];
let typing = new Array();
let option_;
$.getJSON("../Core/typing.json").done(function (json){
  for(let i = 0; i < json.oneletter.length; i++){
    typing[json.oneletter[i].letter] = json.oneletter[i].rome;
  }
  for(let i = 0; i < json.twoletter.length; i++){
    typing[json.twoletter[i].letter] = json.twoletter[i].rome;
  }
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
$.getJSON("../User/index.json").done(function (json){
  csvList = json.Data;
  for(let i=0;i<csvList.length;i++){
    csv_("../User/" + csvList[i].url, i);
  }
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
//
$(function(){
  let game = document.getElementById("game");
  document.getElementById("start_button").addEventListener("mousedown", gamestart, false);
  function gamestart(){
    alert("Enterでゲームスタート!");
    dat_now = Date.now();
    $("#start_button").css("display", "none");
    $("#wid").css("display", "block");
  }
})
document.addEventListener('keydown', keydown_event);
function keydown_event(e){
  let key = '';
  let E = e.keyCode;
  if(E == 13){
    key = "Enter";
  }
  else if(E == 32){
    key = "Space"
  }
  else if(E >= 48 && E < 58){
    key = e.key;
  }
  else if(E >= 65 && E < 91){
    key = e.key;
  }
  else if(E == 188){
    key = ",";
  }
  else if(E == 189){
    key = "-";
  }
  else if(E == 190){
    key = "."
  }
  if(key != '') console.log(key);
}
setInterval( ()=>{
  stpwtch = Date.now() - dat_now;
  $("#time").html("経過時間 " + String(( '00' + Math.floor(stpwtch/60000) ).slice( -2 )) + ":" + String(( '00' + Math.floor((stpwtch%60000)/1000) ).slice( -2 )) + ":" + String(( '00' + Math.floor(stpwtch % 1000)) ).slice( -2 ));
}, 10 );