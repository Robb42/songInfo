"use strict"

const YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search";
const LYRICS_URL = "https://api.musixmatch.com/ws/1.1/";
const SONGFACTS_URL = "";
const REVIEWS_URL = "";
const WIKI_URL = "https://en.wikipedia.org/w/api.php";
const TOURS_URL = "";

function getDatafromApi(searchTerm, callback) {
  /*const queryYoutube = {
    part: "snippet",
    key: "AIzaSyBZcoFcX2hjtIRehNbhQyocEprrx2cOAfM",
    q: `${searchTerm} song`,
    maxResults: "3",
    type: "video",
    order: "viewCount",
    nextPageToken: "next",
    prevPageToken: "prev"
  };*/
  //$.getJSON(YOUTUBE_URL, queryYoutube, callback);

  const queryLyrics = {
    apikey: "723d40ea5e7c1abaf24147f2d427939a",
    q_track: `${searchTerm}`,
    s_track_rating: "DESC",
    origin: "*"
  };
  $.getJSON(LYRICS_URL, queryLyrics, callback);

  const querySongfacts = {};
  const queryReviews = {};

  const queryWiki = {
    action: "query",
    list: "search",
    srsearch: `${searchTerm} song`,
    format: "json",
    origin: "*"
  };
  $.getJSON(WIKI_URL, queryWiki, callback);

  const queryTours = {};
}

function renderResult(result) {
  //let youtubeThumb = result.snippet.thumbnails.medium.url;
  //let youtubeTitle = result.snippet.title;
  //let youtubeID = result.id.videoId;
  //let youtubeImgAlt = result.snippet.description;

  //let trackId = search.result[0].pageid;
  
  //let wikiInfo = result.snippet; 

  return `
  <p>${lyricsBody}</p>
  `
}

function displaySearchData(data) {
  //const results = data.items.map((item, index) => renderResult(item));
  console.log(data);
  const results = data.query.map((item, index) => renderResult(item));
  
  //const results = data.query.search.map((item, index) => renderResult(item)); 
  console.log(results);
  $("#results").prop("hidden", false).html(results);
}

function watchSubmit() {
  $("#js-search-form").submit(function() {
    event.preventDefault();
    const query = $("#song-search").val();
    console.log(query);
    getDatafromApi(query, displaySearchData);
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