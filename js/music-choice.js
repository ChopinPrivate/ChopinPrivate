function makeMusicList(data){
	let music_list = document.getElementById("music_list");
	
	for (let i=0; i<data.length; i++){
		let music_element = document.createElement("li");
		let music_link = document.createElement("a");
		music_link.innerText = data[i];
		console.log(i);
		music_link.href = "music-listen.html?itm=" + String(i+1);
		music_element.append(music_link);
		music_list.append(music_element);
	}
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
		makeMusicList(data); //読み込んだJSONをもとに楽曲リストを作成
	}
}


window.addEventListener("load", readJSON);