
$(document).ready(function(){
	console.log("Loaded!");
	var artist;

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
			console.log(artist);
			soundcloud(artist, location);
			}
			else{
			alert("No city / artists found!");
			}
		}
	});
}

function soundcloud(searchQuery, location) {
	$('#artist').html('"'+searchQuery+'" hails from '+location+'. ');

	SC.initialize({
		client_id: 'd2bd4571b734b31bdc4af3044c973837'
	});	

	SC.get('/tracks', { q: searchQuery }, function(tracks) {
	  	// console.log(tracks);
	  	var num = tracks.length*Math.floor(Math.random());
	  	SC.oEmbed(tracks[num].permalink_url, {
	  		// maxheight: 100
	  	},
	  	document.getElementById('soundcloud'));
	});

	$('#artist').append('<button id="playlist" class="button">Generate Playlist</button>');
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