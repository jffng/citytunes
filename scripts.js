$(document).ready(function(){
	console.log("Loaded!");
	var artist;
	$('#inputBox').focus();

	$('#inputBox').keypress(function(event) {
		if(event.keyCode == 13){
		var inputTerm = $('#inputBox').val();
		echoNest(inputTerm);
		}
	});
	$('#sent').click(function(){
		var inputTerm = $('#inputBox').val();
		echoNest(inputTerm);	
	});
});

function echoNest(location){
	//Write AJAX Code
	var URL = 'http://developer.echonest.com/api/v4/artist/search?api_key=HRUK9I5QKPKDP2GXZ&format=jsonp&artist_location=';

	// ajax method of $ object takes an object of whose properties are many
	$.ajax({
		url: URL + location,
		type: 'GET',
		dataType: 'jsonp',
		error: function(msg){
			console.log("shit, didn't work!")
			console.log(msg);
		},
		success: function(data){
			console.log("It worked!");
			console.log(data);
			var num = Math.floor(data.response.artists.length*Math.random());
			if (data.response.artists.length > 0){
			artist = data.response.artists[num].name;
			artistID = data.response.artists[num].id;
			console.log(artistID);
			artistBio(artistID);
			soundcloud(artist, location);
			}
			else{
			alert("No city / artists found!");
			}
		}
	});
}

function artistBio(artistID) {
	$.ajax({
		url: 'http://developer.echonest.com/api/v4/artist/biographies?api_key=HRUK9I5QKPKDP2GXZ&id='+artistID+'&format=jsonp&results=1&start=0&license=cc-by-sa',
		type: 'GET',
		dataType: 'jsonp',
	})
	.done(function(data) {
		console.log("success");
		var bio = data.response.biographies[0].text;
		if(bio.length > 255 ) bio = bio.substring(0,900);
		// console.log(bio+"...");
		$('#artistinfo').append('<p style="font-size: 16px; display: block">'+bio+'...</p>');
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

function soundcloud(searchQuery, location) {
	$('#artistinfo').html('"'+searchQuery+'" hails from '+location+'. ');

	SC.initialize({
		client_id: 'd2bd4571b734b31bdc4af3044c973837'
	});	

	SC.get('/tracks', { q: searchQuery }, function(tracks) {
	  	// console.log(tracks);
	  	var num = tracks.length*Math.floor(Math.random());
	  	SC.oEmbed(tracks[num].permalink_url, {
		  		maxheight: 212
	  	},
	  	document.getElementById('soundcloud'));
	});

	$('#artistinfo').append('<button id="playlist" class="button">Generate Playlist</button>');
	$('#playlist').click(function(){
		console.log('playlist generation');
		playlist(artist);
	});
}

function playlist(artist){
	SC.get('/playlists', { 
		q: artist,
		sharing: "public",
		embeddable_by: "all",
		streamable: true
		 }, function(playlists) {
	 		SC.oEmbed(playlists[0].permalink_url, document.getElementById('soundcloud'));
  	});
}