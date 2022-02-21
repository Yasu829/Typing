// --- functions --- //
function isHanEisu(str){
  str = (str==null)?"":str;
  if(str.match(/^[A-Za-z0-9]*$/)){
    return true;
  }else{
    return false;
  }
}
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
  function one_sound(i){
    if(read[i] in typing){
      for(let j=0;j<typing[read[i]].length;j++){
        table[i].push(typing[read[i]][j]);
      }
    }
    else console.log("error" + i);
  }
  // two-sound
  function two_sound(i){
    if(read[i] + read[i+1] in typing){
      for(let j=0;j<typing[read[i] + read[i+1]].length;j++){
        table[i].push(typing[read[i] + read[i+1]][j] + "|");
      }
    }
  }
  function ltu_sound(i){
    if(read[i+1] != 'あ' && read[i+1] != 'い' && read[i+1] != 'う' && read[i+1] != 'え' && read[i+1] != 'お' && read[i+1] != 'な' && read[i+1] != 'に' && read[i+1] != 'ぬ' && read[i+1] != 'ね' && read[i+1] != 'の' && read[i+1] != '　' && read[i+1] != '、' && read[i+1] != '。' && read[i+1] != 'ー' && read[i+1] != 'ん' && !isHanEisu(read[i+1])){
      if(read[i+1] in typing){
        for(let j=0;j<typing[read[i+1]].length;j++){
          table[i].push(typing[read[i+1]][j][0] + typing[read[i+1]][j] + "|");
        }
      }
      if(i<read.length-2){
        if(read[i+1] + read[i+2] in typing){
          for(let j=0;j<typing[read[i+1] + read[i+2]].length;j++){
            table[i].push(typing[read[i+1] + read[i+2]][j][0] + typing[read[i+1] + read[i+2]][j] + "$");
          }
        }
      }
    }
  }
  function nn_sound(i){
    if(read[i+1] != 'あ' && read[i+1] != 'い' && read[i+1] != 'う' && read[i+1] != 'え' && read[i+1] != 'お' && read[i+1] != 'な' && read[i+1] != 'に' && read[i+1] != 'ぬ' && read[i+1] != 'ね' && read[i+1] != 'の' && read[i+1] != '　' && read[i+1] != '、' && read[i+1] != '。' && read[i+1] != 'ー' && read[i+1] != 'ん' && !isHanEisu(read[i+1])){
      if(read[i+1] in typing){
        if(read[i+1] in typing){
          for(let j=0;j<typing[read[i+1]].length;j++){
            table[i].push("n" + typing[read[i+1]][j] + "|");
          }
        }
        if(i<read.length-2){
          if(read[i+1] + read[i+2] in typing){
            for(let j=0;j<typing[read[i+1] + read[i+2]].length;j++){
              table[i].push("n" + typing[read[i+1] + read[i+2]][j] + "$");
            }
          }
        }
      }
    }
  }
  for(let i=0;i<read.length-1;i++){
    if(read[i] == 'っ') ltu_sound(i)
  }
  for(let i=0;i<read.length-1;i++){
    if(read[i] == 'ん') nn_sound(i)
  }
  for(let i=0;i<read.length-1;i++){
    two_sound(i);
  }
  for(let i=0;i<read.length;i++){
    one_sound(i);
  }
  return table;
  // っ
}

// --- definition --- //
let Problem_set = 0;
let Problems = 10;
function change_number(i){
  if(i == 1) Problems = 1;
  if(i == 2) Problems = 5;
  if(i == 3) Problems = 10;
  if(i == 4) Problems = -1;
  console.log(Problems);
}
let stpwtch;
let dat_now;
let csvList;
let csvAll = [[]];
let typing = new Array();
let sound_miss = new Audio("../Assets/Sounds/miss.wav");
let sound_correct = new Audio("../Assets/Sounds/correct.wav");
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
  $("#high_score").html("ハイスコア: " + window.parent.high_score_change(0));
  let play_list = new Array();
  let type_ = 0;
  let miss_ = 0;
  let tweet = "";
  document.getElementById("start_button").addEventListener("mousedown", gamestart, false);
  document.getElementById("back_to_start").addEventListener("click",backtostart,false);
  function gamestart(){
    alert("Enterでゲームスタート!");
    dat_now = Date.now();
    $("#start_button").css("display", "none");
    $("#wid").css("display", "block");
    $("#result").css("display", "none");
    play_list = [];
    type_ = 0;
    miss_ = 0;
    $("#type").html("正解数 " + ('000' + type_).slice(-3));
    $("#miss").html("ミス数 " + ('000' + miss_).slice(-3));
    if(Problems == -1){
      for(let i=0;i<csvAll[Problem_set].length;i++){
        play_list.push(i);
      }
    }
    else{
      for(let i=0;i<Problems;i++){
        let x = Math.floor(Math.random() * csvAll[Problem_set].length);
        if(!play_list.includes(x)) play_list.push(x);
        else i--;
      }
    }
    host(0);
  }
  function gameend(){
    let score_ = Math.floor(type_ * 3600000 / stpwtch * ((type_ - miss_) / type_) * ((type_ - miss_) / type_) + type_ * 5);
    $("#start_button").css("display", "none");
    $("#wid").css("display", "none");
    $("#result").css("display", "block");
    $("#time_").html("経過時間 " + String(( '00' + Math.floor(stpwtch/60000) ).slice( -2 )) + ":" + String(( '00' + Math.floor((stpwtch%60000)/1000) ).slice( -2 ))+ ":" + String(( '00' + Math.floor(stpwtch % 1000)) ).slice( -2 ));
    $("#type_").html("正解数 " + ('000' + type_).slice(-3));
    $("#miss_").html("ミス数 " + ('000' + miss_).slice(-3));
    $("#high_score").html("ハイスコア: " + window.parent.high_score_change(score_));
    if(score_ == window.parent.high_score_change(score_)) $("#score_").html("スコア " + score_ + "<span id='don'>←ハイスコア更新!!!</span>");
    else $("#score_").html("スコア " + score_);
    if(Problems == -1) tweet = "スーチー打を問題数: " + csvList[i].length +"(全問)でプレイし、経過時間: " + String(( '00' + Math.floor(stpwtch/60000) ).slice( -2 )) + ":" + String(( '00' + Math.floor((stpwtch%60000)/1000) ).slice( -2 ))+ ":" + String(( '00' + Math.floor(stpwtch % 1000)) ).slice( -2 ) + " 正解数: " + ('000' + type_).slice(-3) + " ミス数: " + ('000' + miss_).slice(-3) + " 総合スコア: " + score_ + "でクリアしました！";
    else tweet = "スーチー打を問題数: " + Problems + "でプレイし、経過時間: " + String(( '00' + Math.floor(stpwtch/60000) ).slice( -2 )) + ":" + String(( '00' + Math.floor((stpwtch%60000)/1000) ).slice( -2 ))+ ":" + String(( '00' + Math.floor(stpwtch % 1000)) ).slice( -2 ) + " 正解数: " + ('000' + type_).slice(-3) + " ミス数: " + ('000' + miss_).slice(-3) + " 総合スコア: " + score_ + "でクリアしました！";
    let at_ = document.getElementById("twitter").attributes;
    document.getElementById("twitter").setAttribute("href", "https://twitter.com/share?hashtags=スーチー打&url=https://Yasu829.github.io/Typing&text=" + tweet);
  }
  function backtostart(){
    $("#start_button").css("display", "block");
    $("#wid").css("display", "none");
    $("#result").css("display", "none");
    removeEventListener("click",backtostart,false);
  }
  function host(n){
    console.log(play_list);
    sent_display(play_list[n],n);
  }
  function create_rom(num, arr, p){
    let s_ = "<span id='don'>";
    let tab_ = generate_spell(csvAll[Problem_set][num][1]);
    // console.log(tab_);
    for(let i=0;i<tab_.length;i++){
      let flag_b = false;
      if(i == p){ s_ += "</span>" }
      if(tab_[i][arr[i]].slice(-1) == '$'){
        s_ += tab_[i][arr[i]].slice(0,tab_[i][arr[i]].length - 1);
        i+=2;
      }
      if(tab_[i][arr[i]].slice(-1) == '|'){
        s_ += tab_[i][arr[i]].slice(0,tab_[i][arr[i]].length - 1);
        i++;
      }
      else s_ += tab_[i][arr[i]].slice(0,tab_[i][arr[i]].length);
    }
    return s_
  }
  function sent_display(num,n){
    let key = '';
    let pointer_ = 0;
    let t_b = new Array(csvAll[Problem_set][num][1].length);
    console.log(t_b.length);
    for(let i=0;i<t_b.length;i++) t_b[i] = 0;
    $("#fr_s").html(csvAll[Problem_set][num][1]);
    $("#ja_s").html(csvAll[Problem_set][num][0]);
    $("#rom_s").html(create_rom(num,t_b,pointer_));
    document.removeEventListener('keydown', keydown_event);
    document.addEventListener('keydown', keydown_event);
    function keydown_event(e){
      let E = e.keyCode;
      if(E == 13){
        // key += "";
      }
      else if(E == 32){
        key += " "
      }
      else if(E >= 48 && E < 58){
        key += e.key;
      }
      else if(E >= 65 && E < 91){
        key += e.key;
      }
      else if(E == 188){
        key += ",";
      }
      else if(E == 189){
        key += "-";
      }
      else if(E == 190){
        key += "."
      }
      if(key != ''){
        let point_ = generate_spell(csvAll[Problem_set][num][1]);
        console.log(point_[pointer_]);
        let flag_a = false;
        for(let i=point_[pointer_].length-1;i>=0;i--){
          console.log(point_[pointer_][i]);
          if(point_[pointer_][i].slice(0,key.length) == key){
            if(point_[pointer_][i].slice(-1) == '|'){
              if(point_[pointer_][i].slice(0,point_[pointer_][i].length-1) == key){
                t_b[pointer_] = i;
                console.log("a");
                pointer_+=2;
                key = "";
              }
            }
            else if(point_[pointer_][i].slice(-1) == '$'){
              if(point_[pointer_][i].slice(0,point_[pointer_][i].length-1) == key){
                t_b[pointer_] = i;
                console.log("b");
                pointer_+=3;
                key = "";
              }
            }
            else if(point_[pointer_][i] == key){
              t_b[pointer_] = i;
              console.log("c");
              pointer_++;
              key = "";
            }
            else{
              t_b[pointer_] = i;
            }
            flag_a = true;
            $("#rom_s").html(create_rom(num,t_b,pointer_));
            if(pointer_ == t_b.length) break;
          }
        }
        if(flag_a){
          type_++;
          console.log(type_);
          console.log(pointer_);
          $("#type").html("正解数 " + ('000' + type_).slice(-3));
        }
        else{
          sound_miss.play();
          console.log(key + "|");
          key = key.slice(0,key.length-1);
          miss_++;
          $("#miss").html("ミス数 " + ('000' + miss_).slice(-3));
          // console.log(miss_);
        }
      }
      if(pointer_ == t_b.length){
        document.removeEventListener('keydown', keydown_event);
        sound_correct.play();
        setTimeout(() => {
          if(Problems == -1){
            console.log(pointer_);
            if(n == play_list.length - 1){
              gameend();
            }
            else host(n+1);
          }
          else{
            if(n == Problems - 1){
              gameend();
            }
            else host(n+1);
          }
        }, 50);
      }
    }
  }
})
setInterval( ()=>{
  stpwtch = Date.now() - dat_now;
  $("#time").html("経過時間 " + String(( '00' + Math.floor(stpwtch/60000) ).slice( -2 )) + ":" + String(( '00' + Math.floor((stpwtch%60000)/1000) ).slice( -2 )) + ":" + String(( '00' + Math.floor(stpwtch % 1000)) ).slice( -2 ));
}, 10 );