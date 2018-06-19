"use strict"

function getDataFromApi(searchTerm) {
  
  //Youtube API
  const queryYoutube = {
    part: "snippet",
    key: "AIzaSyBZcoFcX2hjtIRehNbhQyocEprrx2cOAfM",
    q: `${searchTerm} song`,
    maxResults: "5",
    type: "video",
    order: "viewCount",
  }
  $.getJSON("https://www.googleapis.com/youtube/v3/search", queryYoutube, function (obj) {
    $("#results").prop("hidden", false);
    $("#watch-results").append(`
      <img src="${obj.items[0].snippet.thumbnails.medium.url}">
    `);
  });
  
  //Wikipedia API
  const queryWiki = {
    action: "query",
    list: "search",
    srsearch: `${searchTerm} song`,
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
      q_track: `${searchTerm}`,
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
      term: `${searchTerm}`,
      country: "US",
    },
    dataType: "json",
    url: "https://itunes.apple.com/search",
    success: function(data) {
      $("#results").prop("hidden", false);
      $("#meaning-results").append(`
        <audio controls>
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
      q: `${searchTerm}`,
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
    getDataFromApi(query);
  });
}

$(watchSubmit);