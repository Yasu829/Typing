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
let csvList;
let csvAll = [[]];
let typing = new Array();
let option_;
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
$.getJSON("User/index.json").done(function (json){
  csvList = json.Data;
  for(let i=0;i<csvList.length;i++){
    csv_("User/" + csvList[i].url, i);
  }
}).fail(function(){
  alert("jsonファイルの読み込みに失敗しました");
});
// --- options --- //
function load() {
  option_ = { "R": 200, "G": 200, "B": 200 };
  if(localStorage.flag1) {
    option_.R = localStorage.R;
    option_.G = localStorage.G;
    option_.B = localStorage.B;
  }
  reload();
  $(function(){
    document.getElementById("R_").innerHTML = option_.R;
    document.getElementById("G_").innerHTML = option_.G;
    document.getElementById("B_").innerHTML = option_.B;
    color_try(option_.R, option_.G, option_.B);
    color_change(option_.R, option_.G, option_.B);
  })
}
function reload(){
  $(function(){
    $('#R').attr("value", option_.R);
    $('#G').attr("value", option_.G);
    $('#B').attr("value", option_.B);
  })
}
function ch(s){
  // option_[s] = Number(document.getElementById(s).value);
  document.getElementById(s + "_").innerHTML = option_[s];
  // color_change(option_.R, option_.G, option_.B);
  color_try(Number(document.getElementById("R").value),Number(document.getElementById("G").value),Number(document.getElementById("B").value));
}
function color_try(a,b,c){
  let color_try = document.getElementsByClassName('color_try');
  color_try[0].style.backgroundColor = "rgb("+a+","+b+","+c+")"; 
}
function color_change(a, b, c){
  let color1 = document.getElementsByClassName('color1');
  let color2 = document.getElementsByClassName('color2');
  let border1 = document.getElementsByClassName('border1');
  for(let i=0;i<color1.length;i++){
    color1[i].style.backgroundColor = "rgb("+a+","+b+","+c+")"; 
  }
  for(let i=0;i<color2.length;i++){
    color2[i].style.backgroundColor = "rgb("+(255 -(255 - a) * 0.6)+","+(255 - (255 - b) * 0.6)+","+(255 - (255 - b) * 0.6)+")"; 
  }
  for(let i=0;i<border1.length;i++){
    border1[i].style.border = "rgb("+a+","+b+","+c+") " + "solid 5px";
  }
}
function save() {
  option_.R = Number(document.getElementById("R").value)
  option_.G = Number(document.getElementById("G").value)
  option_.B = Number(document.getElementById("B").value)
  localStorage.setItem('flag1', true);
  localStorage.setItem('R', option_.R);
  localStorage.setItem('G', option_.G);
  localStorage.setItem('B', option_.B);
  color_change(option_.R, option_.G, option_.B);
  alert("設定を保存しました");
}
load();

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
document.addEventListener('DOMContentLoaded', function(){
  function stopEvent_play(event) {
    event.stopPropagation();
  }
  function stopEvent_option(event) {
    event.stopPropagation();
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