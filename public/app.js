$(document).ready(() => {
  let sources = ["https://hbr.org", "http://nytimes.com", "http://wsj.com", "http://economist.com", 
    "http://forbes.com", "https://ft.com", "http://time.com"];
  let results = [];
  // Submit event handler
  $('#search-form').submit((e) => {
    e.preventDefault();
    let query = $('#search-term').val();
    console.log(query);
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
      console.log(paramsArray);
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
      }
    )
  }

  // showResults using ES6
  var showResults = (data) => {
    console.log(data.docSentiment.score);
  }

  var averageSentimentScore = (record) => {
    // Initialize variable at zero
    let total = 0;
    for (var i = 0; i < record.length; i++) {
      total += Number(record[i].docSentiment.score);
    }
    let average = total / record.length;
    // toFixed(numberofdecimalplaces)
    console.log(average.toFixed(4));
  }

  // fusionCharts
  /*function getData(){
      //use the find() API and pass an empty query object to retrieve all records
      dbObject.collection("entities").find({}).toArray(function(err, docs){
        if ( err ) throw err;
        var monthArray = [];
        var score = [];
        var averageSentimentScore = [];
        var sentimentType = [];
     
        for ( index in docs){
          var doc = docs[index];
          //category array
          var month = doc['month'];
          //series 1 values array
          var sentimentScore = doc['score'];
          //series 2 values array
          var chartAverageSentimentScore = doc['average'];
          monthArray.push({"label": month});
          score.push({"value" : score});
          average.push({"value" : average});
          source.push({"value": source});
        }
     
        var dataset = [
          {
            "average" : "Average Sentiment Score",
            "data" : averageSentimentScore
          },
          {
            "type" : "Sentiment Type",
            "data": averageSentimentType
          }
        ];
     
        var response = {
          "dataset" : dataset,
          "categories" : monthArray
        };
      });
    }

    var chartData;
    $(function(){
      $.AJAX({
        url: 'http://localhost:8080/entities-app',
        type: 'GET',
        success : function(data) {
          chartData = data;
          console.log(data);
    }
  });
});
    */
})