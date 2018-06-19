"use strict"

const YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search";
const LYRICS_URL = "https://api.lyrics.ovh/v1/artist/";
const ITUNES_URL = "https://itunes.apple.com/search"
const SONGFACTS_URL = "";
const REVIEWS_URL = "";
const WIKI_URL = "https://en.wikipedia.org/w/api.php";
const TOURS_URL = "";

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
  $.getJSON(YOUTUBE_URL, queryYoutube, function (obj) {
    $("#results").prop("hidden", false).append(`
    <div><img src="${obj.items[0].snippet.thumbnails.medium.url}">
    </div>
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
  $.getJSON(WIKI_URL, queryWiki, function (obj) {
    $("#results").prop("hidden", false).append(`
    <div>
      <h2>Wiki Snippet: </h2>
      <p>${obj.query.search[0].snippet}</p>
      <p>Wiki Page: https://en.wikipedia.org/?curid=${obj.query.search[0].pageid}</p>
    </div>
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
    $("#results").prop("hidden", false).append(`
      <div>
        <h2>Musixmatch info/lyrics</h2>
        <ul>
          <li>Name: ${data.message.body.track_list["0"].track.track_name}</li>
          <li>Artist: ${data.message.body.track_list["0"].track.artist_name}</li>
          <li>Album: ${data.message.body.track_list["0"].track.album_name}</li>
          <li>Release Date: ${data.message.body.track_list["0"].track.first_release_date}</li>
          <li>Genre: ${data.message.body.track_list["0"].track.primary_genres.music_genre_list[0].music_genre.music_genre_name}</li>
          <li>Track Length: ${data.message.body.track_list["0"].track.track_length}</li>
        </ul>
      </div>
    `);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });

  //iTunes
  $.ajax({
    type: "GET",
    data: {
      term: `${searchTerm}`,
      country: "US",
    },
    url: "https://itunes.apple.com/search",
    success: function(data) {
      console.log(data);
      /*$("#results").prop("hidden", false).append(`
        <div>
          <h2>iTunes info: </h2>
          <p></p>
        </div>
      `)*/
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

/* `
        <div class="col-4">
        <div class="searchContainer">
          <div>
            <h2>Lyrics</h2>

          </div>   
        </div>
      </div>
      
      <div class="col-4">
        <div class="searchContainer">
          <div>
            <h2>Meaning</h2>

          </div>        
        </div>
      </div>
      
      <div class="col-4">
        <div class="searchContainer">
          <div>
            <h2>Watch</h2>
            <a href="https://www.youtube.com/watch?v=${youtubeID}"><img src="${youtubeThumb}" alt="${youtubeImgAlt}"></a>
          </div>          
        </div>
      </div> 
      
      <div class="col-4">
        <div class="searchContainer">
          <div>
            <h2>Reviews</h2>

          </div>          
        </div>
      </div>
      
      <div class="col-4">
        <div class="searchContainer">
          <div>
            <h2>Artist Info</h2>

          </div>          
        </div>
      </div> 
      
      <div class="col-4">
        <div class="searchContainer">
          <div>
            <h2>On Tour?</h2>

          </div>          
        </div>
      </div>  
      `*/