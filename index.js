"use strict"

function getArtistQuery(query) {
  $.ajax({
    type: "GET",
    data: {
      apikey: "723d40ea5e7c1abaf24147f2d427939a",
      q_track: `${query}`,
      s_track_rating: "DESC", 
      format: "jsonp",
      callback: "jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/track.search",
    dataType: "jsonp",
    jsonpCallback: "jsonp_callback",
    contentType: "application/json",
    success: function(data) {
      let querySongName = query;
      let queryArtistName = data.message.body.track_list[0].track.artist_name;
      //confirmQuery(queryArtistName, querySongName);
      getDataFromApi(queryArtistName, querySongName);
    }
  });
}

function confirmQuery(artistName, songName) {
  $("#confirm-query").prop("hidden", false);
  $(".confirmQuery p:first").append(`
    ${songName} by ${artistName} 
    `)
}

function watchConfirmClicks() {
  $("#yes-right-song").click(function() {
    getDataFromApi();
  });
  $("#no-wrong-song").click(function() {
    $("#confirm-query").prop("hidden", true);
  });
}

function getDataFromApi(artistName, songName) {
  
  //Youtube API
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
  
  //Wikipedia API
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
      <p>${obj.query.search[0].snippet}</p>
      <p>Wiki Page: https://en.wikipedia.org/?curid=${obj.query.search[0].pageid}</p>
    `)
  });

  //Musixmatch API
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
      $("#results").prop("hidden", false);
      $("#info-results").append(`
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

  //iTunes
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
      $("#info-results").append(`
        <audio id="preview-player" controls autoplay>
          <source src="${data.results[0].previewUrl}" type="audio/x-m4a">
        </audio>
      `)
    }
  });

  //SeatGeek
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
      if (data.performers[0].has_upcoming_events === false) {
        $("#results").prop("hidden", false);
        $("#tour-results").append(`
          <p>No upcoming shows</p>
        `)        
      } else {
        $("#results").prop("hidden", false);
        $("#tour-results").append(`
          <p>Upcoming shows</p>
        `)      
      }
    }
  });
}

function watchSubmit() {
  $("#js-search-form").submit(function () {
    event.preventDefault();
    const query = $("#song-search").val();
    //getDataFromApi(query);
    getArtistQuery(query);
  });
}

$(watchSubmit);
$(watchConfirmClicks);