$(document).ready(() => {
  let sources = ["https://hbr.org", "http://nytimes.com", "http://wsj.com", "http://economist.com", 
    "http://forbes.com", "https://ft.com", "http://time.com"];
  let results = [];
  $('#header').hide();
  $('.results').hide();
  $('#sign-in-to-save').hide();
  // Submit event handler
  $('#search-form').submit((e) => {
    e.preventDefault();
    let query = $('#search-term').val();
    // Results object
    // Accumulate results in an object, then display those results
    let record = {
      date: new Date (), 
      scores: [],
      types: []
    }
    // Call this once
    getEntities(query);
  })

  // Extract entities from Alchemy API
  // Only pass URL now
  var getEntities = (query) => {
    const ALCHEMY_URL = 'https://gateway-a.watsonplatform.net/calls/url/URLGetTextSentiment';
    let params = {
      q: query,
      url: "",
      outputMode: "json",
      part: 'snippet',
      apikey: '0ea95031ba8028ae9a37a56a078288bcbb996e11'
    }
    let paramsArray = [];
    for (var i = 0; i < sources.length; i++) {
      var temp = Object.create(params);
      temp.url = sources[i];
      paramsArray.push(temp);
    }

    // Run parallel asynchronous AJAX requests with jQuery promise
    $.when(
      
      $.getJSON(ALCHEMY_URL, paramsArray[0], (data) => {
        // There will be one for each of the 5 results
        results.push(data);
      }),
      
      $.getJSON(ALCHEMY_URL, paramsArray[1], (data) => {
        // There will be one for each of the 5 results
        results.push(data);
      }),
      
      $.getJSON(ALCHEMY_URL, paramsArray[2], (data) => {
        // There will be one for each of the 5 results
        results.push(data);
      }),
      $.getJSON(ALCHEMY_URL, paramsArray[3], (data) => {
        // There will be one for each of the 5 results
        results.push(data);
      }),
      $.getJSON(ALCHEMY_URL, paramsArray[4], (data) => {
        // There will be one for each of the 5 results
        results.push(data);
      }),
      $.getJSON(ALCHEMY_URL, paramsArray[5], (data) => {
        // There will be one for each of the 5 results
        results.push(data);
      }),
      $.getJSON(ALCHEMY_URL, paramsArray[6], (data) => {
        // There will be one for each of the 5 results
        results.push(data);
      })
    ).then(function() {
        console.log(results);
        averageSentimentScore(results);



        showResults(results);
      }
    )
  }

  // showResults using ES6
  var showResults = (data) => {
    $('#header').show();
    $('.results').show();
    var html = "";
    for (var i = 0; i < data.length; i++) {
      html += "<tr>";
      html += "<td>" + cleanURL(data[i].url) + "</td>";
      html += "<td>" + data[i].docSentiment.score + "</td>";
      html += "<td>" + data[i].docSentiment.type + "</td>";
      html += "<td>" + Date().slice(0,-24) + "</td>";
      html += "</tr>";
    }
    $('#results').append(html);
    $('#sign-in-to-save').show();
  }

  // Clean URL function
  var cleanURL = (url) => {
    var position = url.indexOf("://");
    url = url.slice(position+3);
    var position = url.indexOf(".com");
    if (position !== -1) {
      url = url.slice(0,position+4);
    }
    return url;
  }

  var averageSentimentScore = (record) => {
    // Initialize variable at zero
    let total = 0;
    for (var i = 0; i < record.length; i++) {
      total += Number(record[i].docSentiment.score);
    }
    let average = total / record.length;
    return average;
  }

  // ADDED BELOW
  // Submit event handler for clicking on "Sign in to Save Report"
  $('#sign-in-to-save').submit( function(e) {
    e.preventDefault();
    document.location.href = '/users/me'
    createUser(account);
    createUser(account);
  })

  var signIn = (account) => {
    let username = "";
    let password = "";
    let firstName = "";
    let lastName = "";
  }

  var createUser = (account) => {
    let username = "";
    let password = "";
    let firstName = "";
    let lastName = "";
  }
  // ADDED ABOVE

})