"use strict"

var backgroundImageUrl = "img/audience.jpg";
var songName = "";
var artistName = "";

function getArtistQuery(query) {
  //function to match song title with artist and gather search results
  $.ajax({
    type: "GET",
    data: {
      term: `${query}`,
      country: "US"
    },
    dataType: "json",
    url: "https://itunes.apple.com/search",
      success: function(data) {
        const songResultsArr = [];
        const artistResultsArr = [];
        const albumResultsArr = [];
        const artResultsArr = [];
        for (let i = 0; i < 6; i++) {
          songResultsArr.push(data.results[i].trackName);
          artistResultsArr.push(data.results[i].artistName);
          albumResultsArr.push(data.results[i].collectionName);
          artResultsArr.push(data.results[i].artworkUrl100);
        }
      confirmQuery(songResultsArr, artistResultsArr, albumResultsArr, artResultsArr);
    }
  });
}

function confirmQuery(songArray, artistArray, albumArray, artArray) {
  $("#confirm-query").prop("hidden", false);
  $("#option-one").append(`
    <h3>${songArray[0]}</h3>
    <h4>${artistArray[0]}</h4>
    <p><img src=${artArray[0]}></p>
    `);
  $("#option-two").append(`
    <h3>${songArray[1]}</h3>
    <h4>${artistArray[1]}</h4>
    <p><img src=${artArray[1]}></p>
    `);
  $("#option-three").append(`
    <h3>${songArray[2]}</h3>
    <h4>${artistArray[2]}</h4>
    <p><img src=${artArray[2]}></p>
    `);
  $("#option-four").append(`
    <h3>${songArray[3]}</h3>
    <h4>${artistArray[3]}</h4>
    <p><img src=${artArray[3]}></p>
    `);
  $("#option-five").append(`
    <h3>${songArray[4]}</h3>
    <h4>${artistArray[4]}</h4>
    <p><img src=${artArray[4]}></p>
    `);
  $("#option-six").append(`
    <h3>${songArray[5]}</h3>
    <h4>${artistArray[5]}</h4>
    <p><img src=${artArray[5]}></p>
    `);
}

function changeBackground(artistName) {
  $.getJSON(`https://rest.bandsintown.com/artists/${artistName}?app_id=c8d76e3370fa422fc61e53c1c69e7402`, function (obj) {
    $(".background").css({
      "background-image": `url(${obj.image_url})`,
      "background-size": "cover",
      "height": "100%",
      "background-position": "top center",
      "background-repeat": "repeat"
    });
  });
}

function getWatchResults(artistName, songName) {
  //get videos from Youtube
  const queryYoutube = {
    part: "snippet",
    key: "AIzaSyBZcoFcX2hjtIRehNbhQyocEprrx2cOAfM",
    q: `${songName} ${artistName}`,
    maxResults: "5",
    type: "video",
    order: "viewCount",
  }
  $.getJSON("https://www.googleapis.com/youtube/v3/search", queryYoutube, function (obj) {
    $("#results").prop("hidden", false);
    $("#watch-results").append(`
      <iframe id="yt-player" type="text/html" src="https://www.youtube.com/embed/${obj.items[0].id.videoId}"></iframe>
      <iframe id="yt-player" type="text/html" src="https://www.youtube.com/embed/${obj.items[1].id.videoId}"></iframe>
      <iframe id="yt-player" type="text/html" src="https://www.youtube.com/embed/${obj.items[2].id.videoId}"></iframe>
      <iframe id="yt-player" type="text/html" src="https://www.youtube.com/embed/${obj.items[3].id.videoId}"></iframe>
      <iframe id="yt-player" type="text/html" src="https://www.youtube.com/embed/${obj.items[4].id.videoId}"></iframe>
    `);
  });
}

function getInfoResults(artistName, songName) {
  //get song info from wiki
  const queryWiki = {
    action: "query",
    list: "search",
    srsearch: `${songName} ${artistName}`,
    format: "json",
    origin: "*"
  }
  $.getJSON("https://en.wikipedia.org/w/api.php", queryWiki, function (obj) {
    $("#results").prop("hidden", false);
    $("#info-results").append(`
      <iframe id="wiki-player-song" type="text/html" scrolling="auto" src="http://en.wikipedia.org/?curid=${obj.query.search[0].pageid}"></iframe>
    `)
  });
}

function getLyricsResults(artistName, songName) {
  //get lyrics from lyrics.ovh
  $.getJSON(`https://api.lyrics.ovh/v1/${artistName}/${songName}`, function (obj) {
    let lyricsString = obj.lyrics;
    let formattedString = lyricsString.replace(/\n/g, "<br />");
    $("#results").prop("hidden", false);
    $("#lyrics-results").append(`
      <p>${formattedString}</p>
    `);
  });
}

function getArtistResults(artistName, songName) {
  //get artist info from Wiki
  const queryArtistWiki = {
    action: "query",
    list: "search",
    srsearch: `${artistName}`,
    format: "json",
    origin: "*"
  }
  $.getJSON("https://en.wikipedia.org/w/api.php", queryArtistWiki, function (obj) {
    $("#results").prop("hidden", false);
    $("#artist-results").append(`
      <iframe id="wiki-player-artist" type="text/html" scrolling="auto" src="http://en.wikipedia.org/?curid=${obj.query.search[0].pageid}"></iframe>
    `)
  });
}

function getTourResults(artistName, songName) {
  //get info from Bandsintown and Seatgeek APIs
  $.ajax({
    type: "GET",
    data: {
      client_id: "MTE5ODc4MTZ8MTUyOTQyNjE4MC4wOQ",
      client_secret: "b178512fb9cf7615fe532cf4391774f3f25bb0acf61ef64a023d6a237e4c10d9",
      q: `${artistName}`,
    },
    dataType: "json",
    url: "https://api.seatgeek.com/2/performers",
    success: function(data) {
      $("#results").prop("hidden", false);
      $("#tour-results").append(`
        <iframe id="seatgeek-player" type="text/html" scrolling="auto" src="${data.performers[0].url}"></iframe>
        `)
    }
  });
}

function getMiscResults(artistName, songName) {
  //get song facts from musixmatch and audio preview from itunes
  $.ajax({
    type: "GET",
    data: {
      apikey: "723d40ea5e7c1abaf24147f2d427939a",
      q_track: `${songName}`,
      q_artist: `${artistName}`,
      s_track_rating: "DESC", 
      format: "jsonp",
      callback: "jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/track.search",
    dataType: "jsonp",
    jsonpCallback: "jsonp_callback",
    contentType: "application/json",
    success: function(data) {
      let mmTrackId = data.message.body.track_list["0"].track.track_id;
      $("#results").prop("hidden", false);
      $("#misc-results").append(`
        <ul>
          <li>Name: ${data.message.body.track_list["0"].track.track_name}</li>
          <li>Artist: ${data.message.body.track_list["0"].track.artist_name}</li>
          <li>Album: ${data.message.body.track_list["0"].track.album_name}</li>
          <li>Release Date: ${data.message.body.track_list["0"].track.first_release_date}</li>
          <li>Genre: ${data.message.body.track_list["0"].track.primary_genres.music_genre_list[0].music_genre.music_genre_name}</li>
          <li>Track Length: ${data.message.body.track_list["0"].track.track_length}</li>
        </ul>
      `);
    },
  });
  $.ajax({
    type: "GET",
    data: {
      term: `${songName} ${artistName}`,
      country: "US",
    },
    dataType: "json",
    url: "https://itunes.apple.com/search",
    success: function(data) {
      $("#results").prop("hidden", false);
      $("#misc-results").append(`
        <audio id="preview-player" controls autoplay>
          <source src="${data.results[0].previewUrl}" type="audio/x-m4a">
        </audio>
      `)
    }
  });
}

function getDataFromApis(artistName, songName) {
  //get data from APIs
  changeBackground(artistName);
  getWatchResults(artistName, songName);
  getInfoResults(artistName, songName);
  getLyricsResults(artistName, songName);
  getArtistResults(artistName, songName);
  getTourResults(artistName, songName);
  getMiscResults(artistName, songName);
}

function watchClicks() {
  //watch main search submit button
  $("#js-search-form").submit(function () {
    event.preventDefault();
    $("#watch-results").empty();
    $("#info-results").empty();
    $("#lyrics-results").empty();
    $("#artist-results").empty();
    $("#tour-results").empty();
    $("#misc-results").empty();
    $("#option-one").empty();
    $("#option-two").empty();
    $("#option-three").empty();
    $("#option-four").empty();
    $("#option-five").empty();
    $("#option-six").empty();
    $("#results").prop("hidden", true);
    const query = $("#song-search").val();
    $("#song-search").val("");
    getArtistQuery(query);
  });

  //watch confirmation dialog box response
  $("#option-one").click(function() {
    songName = $("#option-one").find("h3").text();
    artistName = $("#option-one").find("h3").siblings("h4").text();
    $("#confirm-query").prop("hidden", true);
    getDataFromApis(artistName, songName);
  });
  $("#option-two").click(function() {
    songName = $("#option-two").find("h3").text();
    artistName = $("#option-two").find("h3").siblings("h4").text();
    $("#confirm-query").prop("hidden", true);
    getDataFromApis(artistName, songName);
  });
  $("#option-three").click(function() {
    songName = $("#option-three").find("h3").text();
    artistName = $("#option-three").find("h3").siblings("h4").text();
    $("#confirm-query").prop("hidden", true);
    getDataFromApis(artistName, songName);
  });
  $("#option-four").click(function() {
    songName = $("#option-four").find("h3").text();
    artistName = $("#option-four").find("h3").siblings("h4").text();
    $("#confirm-query").prop("hidden", true);
    getDataFromApis(artistName, songName);
  });
  $("#option-five").click(function() {
    songName = $("#option-five").find("h3").text();
    artistName = $("#option-five").find("h3").siblings("h4").text();
    $("#confirm-query").prop("hidden", true);
    getDataFromApis(artistName, songName);
  });
  $("#option-six").click(function() {
    songName = $("#option-six").find("h3").text();
    artistName = $("#option-six").find("h3").siblings("h4").text();
    $("#confirm-query").prop("hidden", true);
    getDataFromApis(artistName, songName);
  });
}

$(watchClicks);