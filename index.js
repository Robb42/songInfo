"use strict"

const YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/search";
const LYRICS_URL = "";
const SONGFACTS_URL = "";
const REVIEWS_URL = "";
const WIKI_URL = "";
const TOURS_URL = "";

function getDatafromApi(searchTerm, callback) {
  const queryYoutube = {
    part: "snippet",
    key: "AIzaSyBZcoFcX2hjtIRehNbhQyocEprrx2cOAfM",
    q: `${searchTerm}`,
    maxResults: "5",
    type: "video",
    order: "viewCount",
    nextPageToken: "next",
    prevPageToken: "prev"
  };
  const queryLyrics = {};
  const querySongfacts = {};
  const queryReviews = {};
  const queryWiki = {};
  const queryTours = {};
  $.getJSON(YOUTUBE_URL, queryYoutube, callback);
}

function renderResult(result) {
  let youtubeThumb = result.snippet.thumbnails.medium.url;
  let youtubeTitle = result.snippet.title;
  let youtubeID = result.id.videoId;
  let youtubeChannel = result.snippet.channelId;
  let youtubeImgAlt = result.snippet.description;
  return `
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
            <p><a href="https://www.youtube.com/channel/${youtubeChannel}">Click here</a> for more videos from this channel </p>
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
      `
}

function displaySearchData(data) {
  const results = data.items.map((item, index) => renderResult(item));
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