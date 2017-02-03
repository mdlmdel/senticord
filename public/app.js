$(document).ready(() => {
  let sources = ["https://hbr.org", "http://nytimes.com", "http://wsj.com", "http://economist.com", 
    "http://forbes.com", "https://ft.com", "http://time.com"];
  let results = [];
  let globalQuery;
  $('#header').hide();
  $('.results').hide();
  $('#save-report-button').hide();
  $('#view-reports-button').hide();
  $('#view-saved-reports').hide();
  // Submit event handler
  $('#search-form').submit((e) => {
    e.preventDefault();
    let query = $('#search-term').val();
    // Call this once
    getEntities(query);
  })

  // Extract entities from Alchemy API
  // Only pass URL now
  var getEntities = (query) => {
    globalQuery = query;
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
        results.push(data);
      }),
      
      $.getJSON(ALCHEMY_URL, paramsArray[2], (data) => {
        results.push(data);
      }),
      $.getJSON(ALCHEMY_URL, paramsArray[3], (data) => {
        results.push(data);
      }),
      $.getJSON(ALCHEMY_URL, paramsArray[4], (data) => {
        results.push(data);
      }),
      $.getJSON(ALCHEMY_URL, paramsArray[5], (data) => {
        results.push(data);
      }),
      $.getJSON(ALCHEMY_URL, paramsArray[6], (data) => {
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
    $('#save-report-button').show();
    $('#view-reports-button').show();
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

  // Submit event handler for clicking on "Save Report"
  $('#save-report').submit( function(e) {
    e.preventDefault();
    console.log("Save started");
    let record = {
      query: globalQuery,
      date: new Date(), 
      results: results, 
      averageScore: averageSentimentScore(results)
    }
    $.ajax({
      url: "/save-record", 
      type: "POST", 
      data: JSON.stringify(record), 
      dataType: "json", 
      contentType: "application/json", 
      success: function(data) {
        console.log("Succeeded");
      }, 
      error: function() {
        console.log("Error");
      }
    })

  })

  // Submit event handler for clicking on "View Reports"
  $('#view-reports').submit( function(e) {
    e.preventDefault();
    $('#view-saved-reports').show();
    console.log("View reports started");
    $.ajax({
      url: "/view-reports", 
      type: "GET", 
      dataType: "json", 
      success: function(data) {
        console.log("Succeeded");
      }, 
      error: function() {
        console.log("Error");
      }
    })

  })

})