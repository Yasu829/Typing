function csv_(datapath){
  let colors_ = [];
  const req = new XMLHttpRequest();
  req.addEventListener("load", (event) =>{
    const response = event.target.responseText;
    const dataString = response.split('\n');
    for(let i=0;i<dataString.length;i++){
      colors_.push(dataString[i].split(","));
    }
    for(let i=0;i<colors_.length;i++){
      let palette = document.createElement("div");
      palette.setAttribute("onclick","color_try("+colors_[i][0] +","+ colors_[i][1] +"," +colors_[i][2] +")");
      palette.style.backgroundColor = "rgb("+colors_[i][0]+","+colors_[i][1]+","+colors_[i][2]+")";
      console.log(palette);
      document.getElementById("color_palette").innerHTML += (palette).outerHTML; 
    }
  });
  req.open('GET', datapath, true);
  req.send();
}
// --- options --- //
let option_;
function load() {
  option_ = { "R": 200, "G": 200, "B": 200, "Problems": 10};
  if(localStorage.flag1) {
    option_.R = localStorage.R;
    option_.G = localStorage.G;
    option_.B = localStorage.B;
  }
  reload();
  csv_("Core/color.csv");
  $(function(){
    color_try(option_.R, option_.G, option_.B);
    change(option_.R, option_.G, option_.B);
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
  // change(option_.R, option_.G, option_.B);
  color_try(Number(document.getElementById("R").value),Number(document.getElementById("G").value),Number(document.getElementById("B").value));
}
function color_try(a,b,c){
  $('#R').attr("value", a);
  $('#G').attr("value", b);
  $('#B').attr("value", c);
  document.getElementById("R_").innerHTML = a;
  document.getElementById("G_").innerHTML = b;
  document.getElementById("B_").innerHTML = c;
  let color_try = document.getElementsByClassName('color_try');
  color_try[0].style.backgroundColor = "rgb("+a+","+b+","+c+")"; 
}
function change(a, b, c){
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
  $('#game').contents().find('body').css("backgroundColor", "rgb("+a+","+b+","+c+") ");
  $('#game').contents().find('#don').css("backgroundColor", "rgb("+a * 0.8 +","+b * 0.8+","+c * 0.8+") ");
  $('#game').load(function(){
    $('#game').contents().find('body').css("backgroundColor", "rgb("+a+","+b+","+c+") ");
    $('#game').contents().find('#don').css("backgroundColor", "rgb("+a * 0.8+","+b * 0.8+","+c * 0.8+") ");
  });
}
function save() {
  option_.R = Number(document.getElementById("R").value)
  option_.G = Number(document.getElementById("G").value)
  option_.B = Number(document.getElementById("B").value)
  localStorage.setItem('flag1', true);
  localStorage.setItem('R', option_.R);
  localStorage.setItem('G', option_.G);
  localStorage.setItem('B', option_.B);
  change(option_.R, option_.G, option_.B);
  alert("設定を保存しました");
}
function high_score_change(score){
  if(localStorage.flag2){
    if(score > localStorage.High_score){
      localStorage.High_score = score;
    }
  }
  else{
    localStorage.setItem('flag2',true);
    localStorage.setItem('High_score',score);
  }
  return localStorage.High_score;
}
load();
// function goit(read){
//   let table = generate_spell(read);
//   console.log(table);
//   let sentence = "";
//   for(let i=0;i<table.length;i++){
//     let flag = false;
//     for(let j=0;j<table[i].length;j++){
//       if(table[i][j][table[i][j].length - 1] == '|'){
//         flag = true;
//         sentence += table[i][j].substr(0,table[i][j].length - 1);
//         i++;
//         break;
//       }
//     }
//     if(flag) continue;
//     else sentence += table[i][0];
//   }
//   return sentence;
// }
function test(){
  for(let i=0;i<csvAll[0].length;i++){
    console.log(goit(csvAll[0][i][1]));
  }
}
document.addEventListener('DOMContentLoaded', function(){
  function stopEvent_play(event) {
    $('#game').contents().find('#start_button').css("display", "block");
    $('#game').contents().find('#wid').css("display", "none");
    $('#game').contents().find('#fr_s').html("");
    $('#game').contents().find('#ja_s').html("");
    $('#game').contents().find('#rom_s').html("");
    $('#game')[0].contentDocument.location.reload(true)
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