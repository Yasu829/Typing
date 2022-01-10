let csvList;
let csvAll = [[]];
let typing = new Array();
let option_;
function load() {
  if(!localStorage.getItem('option')) {
    option_ = { "R":200, "G":200, "B":200, "name": "noname"};
  } else {
    option_ = localStorage.getItem('option');
  }
  $(function(){
    $('#R').attr("value", option_["R"]);
  })
}
load();
function save() {
  localStorage.setItem('option', option);
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
    else console.log("error");
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
function goit(read){
  let table = generate_spell(read);
  console.log(table);
  let sentence = "";
  for(let i=0;i<table.length;i++){
    let flag = false;
    for(let j=0;j<table[i].length;j++){
      if(table[i][j][table[i][j].length - 1] == '|'){
        flag = true;
        sentence += table[i][j].substr(0,table[i][j].length - 1);
        i++;
        break;
      }
    }
    if(flag) continue;
    else sentence += table[i][0];
  }
  return sentence;
}
function test(){
  for(let i=0;i<csvAll[0].length;i++){
    console.log(goit(csvAll[0][i][1]));
  }
}
$.getJSON("Core/typing.json").done(function (json){
  for(let i = 0; i < json.oneletter.length; i++){
    typing[json.oneletter[i].letter] = json.oneletter[i].rome;
  }
  for(let i = 0; i < json.twoletter.length; i++){
    typing[json.twoletter[i].letter] = json.twoletter[i].rome;
  }
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
function csv_(datapath, num){
  const req = new XMLHttpRequest();
  req.addEventListener("load", (event) =>{
    const response = event.target.responseText;
    const dataString = response.split('\n');
    csvAll.length++;
    for(let i=0;i<dataString.length;i++){
      csvAll[num].push(dataString[i].split(','))
    }
    console.log(csvList[num].name);
    for(let i=0;i<csvAll[num].length;i++){
      console.log(csvAll[num][i][0] + " " + csvAll[num][i][1]);
    }
  });
  req.open('GET', datapath, true);
  req.send();
}
$.getJSON("User/index.json").done(function (json){
  csvList = json.Data;
  for(let i=0;i<csvList.length;i++){
    csv_("User/" + csvList[i].url, i);
  }
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
document.addEventListener('DOMContentLoaded', function(){
  function stopEvent_play(event) {
    event.stopPropagation();
  }
  function stopEvent_option(event) {
    event.stopPropagation();
    save();
  }
  // play
  const overlay_play = document.getElementById('overlay-play');
  function overlayToggle_play() {
    overlay_play.classList.toggle('overlay-on');
  }
  // 指定した要素に対して上記関数を実行するクリックイベントを設定
  const clickArea_play = document.getElementsByClassName('overlay-play-event');
  for(let i = 0; i < clickArea_play.length; i++) {
    clickArea_play[i].addEventListener('click', overlayToggle_play, false);
  }
  const overlayInner_play = document.getElementById('overlay-play-inner');
  overlayInner_play.addEventListener('click', stopEvent_play, false);

  // option
  const overlay_option = document.getElementById('overlay-option');
  function overlayToggle_option() {
    overlay_option.classList.toggle('overlay-on');
  }
  // 指定した要素に対して上記関数を実行するクリックイベントを設定
  const clickArea_option = document.getElementsByClassName('overlay-option-event');
  for(let i = 0; i < clickArea_option.length; i++) {
    clickArea_option[i].addEventListener('click', overlayToggle_option, false);
  }
  const overlayInner_option = document.getElementById('overlay-option-inner');
  overlayInner_option.addEventListener('click', stopEvent_option, false);
}, false);