![picture alt](https://s3-eu-west-1.amazonaws.com/imom-assets/media/myimages/spacelogo.png)

# Spacewalking Data Visualization

> This project is a data visualization of a Nasa database.
> It runs on Python and makes use of Javascript libraries
> to build the graphs.

## Build

### Dependencies
Technology | Version | Reason For Use
--------- | --------| ------------------
Flask | | Flask is a microframework built on python that runs sites like this which interact with databases in an extremely efficient and easy way. Flask is very quick to get up and running and works particularly with mongdb
gunicorn | | used to interact with heroku 
itsdangerous | | Various helpers to pass data to untrusted environments and to get it back safe and sound.
Jinja2 | | Jinja2 is a modern and designer-friendly templating language for Python, modelled after Django’s templates. It is fast, widely used and secure with the optional sandboxed template execution environment:
Bootstrap |  | Used for responsive layout and ease of building navigation
jQuery | | Used in conjunction with Javascript and the other JS libraries listed below to run the graphs
d3 js | | is a JavaScript library for visualizing data. D3 helps you bring data to life using SVG, Canvas and HTML
Crossfilter | | works with d3 to provide for multidimensional filtering of data. (Crossfilter provides the filtering options for the graphs)
dc.js | | used with d3 to render graphs as CSS friendly SVGs
intro.js | | used to set the Tour given when pressing the Start Tour button
PostgreSQL | | The databse that holds all the data the charts are reading from.

### Note on the javascript graphs
The graphs are made with a combination of javascript libraries (listed above) however these libraries don't work so well with responsive layouts. I did my best to create as many workarounds for this as possible. One was a function that reloads the webpage after checking to see if the page size has been refreshed. The pie chart in particular does not play well with beinb resized by the browser window.

### Notes on CSV data
- nasa_study.csv is the original csv file I got from [Nasa Open Data Portal](https://data.nasa.gov/)
- nasa.csv is the edited version used to populate the Postgres Database 

## Testing

### Manual Testing
* I manually tested every component of the site as I built it by running it in the browser and verifying that users could achieve the functionality they were after. For example when I set up logging in and logging out I manually verified that it worked in several different browsers (Chrome, Opera and Firefox) and when something wasn't working I would fix the problem and then reverify that everything was working in each broswer before moving on to the next stage of functionality. 
* I repeated this process to verify:
    * All the links work 
    * all the graphs render
    * the graphs display the correct information they're supposed to
    * the graphs work as they were intended to eg.... clicking Russia in the pie-chart will only show Russian Missions in the table below

### Deployment
* The site is currently deployed on Render: https://nasa-data-visualization.onrender.com/

------------------------------

## Motivation
The project came about from a desire to make a data visualization about something you don't
usually see these kinds of dashboards based on. I researched all sorts of databases and eventually
I stumbled upon Nasa's Open Dev Center and thus the project was born.

## Design Choices
I tried as much as possible to emulate the feeling of being in space with the design. All of the 
data relates to astronauts and cosmanauts spending time in space, so I played on that point 
heavily throughout the design process. 

## Author and Contributors
* [Paul Fleming] (https://www.linkedin.com/in/paulmfleming/) - Coding and Design

* Background Image from www.123rf.com

## Peace and Thanks, Paul
