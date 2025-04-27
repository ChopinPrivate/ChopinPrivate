//URLパラメータを取得
function getParam(name, url){
	if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function makeMusicPlayer(data){
	let item, music_name;
	
	//URLパラメータを取得
	item_str = getParam("itm");
	item = parseInt(item_str);
	
	//曲名を取得
	if (item>0 && item<=data.length) music_name = data[item-1]; //itemが範囲内のとき
	else music_name = data[0]; //itemが範囲外のときは最初の曲名を取得
	
	//タイトルを変更
	document.title = "楽曲視聴｜" + music_name;
	document.getElementById("h2_title").textContent = music_name;
	
	//Audio設定の初期化
	const audio = new Audio("https://chopinprivate.github.io/ChopinPrivate/music/" + music_name + ".m4a"); //oggファイルのパス
	audio.loop = true; //ループ再生有効
	audio.preload = "auto"; //アクセス時のみ読込
	let isPlaying = false; //アクセス時は停止中

	//シークバー
	const seekBar = document.getElementById("seekBar");
    const timeDisplay = document.getElementById("timeDisplay");
	
    //再生ボタンを押したときの挙動
	const play_pause_element = document.getElementById("playPause");
    play_pause_element.addEventListener("click", () => {
      if (isPlaying) { //曲を再生していたときは停止
        audio.pause();
		play_pause_element.innerText = "停止中";
      } else { //曲を停止していたときは再生
        audio.play();
		play_pause_element.innerText = "再生中";		
      }
      isPlaying = !isPlaying; //再生状況を切替
    });
	
	//巻き戻しボタンを押したときの挙動
    document.getElementById("back10").addEventListener("click", () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10); //10秒巻き戻す（10秒未満であった場合は先頭に戻る）
    });

	//先送りボタンを押したときの挙動
    document.getElementById('forward10').addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 10); //10秒進める（ラスト10秒未満であった場合は最後尾へ進む）
    });

	// シークバーの操作
    seekBar.addEventListener("input", () => {
      const seekTo = (seekBar.value / 100) * audio.duration;
      audio.currentTime = seekTo;
    });

	//シークバーの表示
    audio.addEventListener("timeupdate", () => {
      if (!isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100; //進捗状況
        seekBar.value = progress;

        const mins = Math.floor(audio.currentTime / 60); //分の表示
        const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, "0"); //秒の表示
        timeDisplay.textContent = `${mins}:${secs}`; //シークバーに表示
      }
    });
}

function readJSON(){
	//JSONデータ読み込み
	let requestURL = "https://chopinprivate.github.io/ChopinPrivate/json/music.json";
	let request = new XMLHttpRequest();
	request.open("GET", requestURL);
	request.send();
	
	//JSONの文字列をオブジェクトに変換
	request.onload = function(){
		let data_string = request.response;
		data = JSON.parse(data_string);
		makeMusicPlayer(data); //読み込んだJSONをもとにミュージックプレイヤーを作成
	}
}

window.addEventListener("load", readJSON);