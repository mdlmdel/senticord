# SentiCord Trending Sentiment Analysis

SentiCord is a full stack web application that enables users to search for, add, and save sentiment analysis reports on terms, called entities. The application uses the [IBM Watson AlchemyLanguage API](https://www.ibm.com/watson/developercloud/alchemy-language/api/v1/#authentication) to provide sentiment analysis on those entities as they appear on the home pages of the New York Times, Harvard Business Review, Financial Times, Economist, Time, and the Wall Street Journal. Users search for the entity of their choice, and the API returns the results and timestamps the reports. Users can then save a sentiment analysis report on the entity they searched for and retrieve previously saved reports, which they can evaluate over time to identify trends. 

![senticord](https://user-images.githubusercontent.com/20372858/29742466-be798c52-8a4d-11e7-9677-62d831e2f99b.png)

## How the Application was Built

SentiCord was built using MongoDB, Express, Node, client-side JavaScript and jQuery, HTML, CSS, and the IBM Watson AlchemyLanguage API. 

## Running the App

To run the application: 

1. Download the project, and install the dependencies using ```'npm install'```.
2. Use a local server to run the application. 
3. Once the server is running, search for entities of your choice, and save and view reports. 

-MdL