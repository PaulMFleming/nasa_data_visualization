![picture alt](https://s3-eu-west-1.amazonaws.com/imom-assets/media/myimages/spacelogo.png)

# Spacewalking Data Visualization

> This project is a data visualization of a Nasa database.
> It runs on Python and makes use of Javascript libraries
> to build the graphs.

## Build

Technology | Version | Reason For Use
--------- | --------| ------------------
Flask | 0.12.2 | Flask is a microframework built on python that runs sites like this which interact with databases
in an extremely efficient and easy way. Flask is very quick to get u and running and works particularly with mongdb
Pymongo | 3.4.0 | Pymongo contains tools for Python to interact with Mongodb and so was essential here
gunicorn | 19.7.1 | used to interact with heroku 
itsdangerous | 0.24 | Various helpers to pass data to untrusted environments and to get it back safe and sound.
Jinja2 | 2.9.6 | Jinja2 is a modern and designer-friendly templating language for Python, modelled after Django’s templates. 
It is fast, widely used and secure with the optional sandboxed template execution environment:
Bootstrap | 3.2.0 | Used for responsive layout and ease of building navigation
jQuery | 2.1.4 | Used in conjunction with Javascript and the other JS libraries listed below to run the graphs
d3 js | | is a JavaScript library for visualizing data. D3 helps you bring data to life using SVG, Canvas and HTML
Crossfilter | | works with d3 to provide for multidimensional filtering of data. (Crossfilter provides the filtering options for the graphs)
dc.js | | used with d3 to render graphs as CSS friendly SVGs
intro.js | | used to set the Tour given when pressing the Start Tour button
MongoDB | | The databse that holds all the data the charts are eading from.


### Deployment
* The site is deployed on [heroku](www.heroku.com) and uses mongoDB for it's database.

### Build Structure
* As this is a Django site it is composed of different apps which are:
    * __Accounts -__ Controls all the functionality for logging and out, registering new accounts and processing payment
    * __Diary -__ Controls all the functionality for writing a new diary entry and viewing old diary entries
    * __Hello -__ Controls the static pages (the home page and the guide page)
    * __Timer -__ Controls all the functionality relating to viewing the timer and making sure the logged in user will only see their own images
    * __UserUploads -__ Controls the functionality for uploading images to Amazon S3


------------------------------

## Testing

### Manual Testing
* I manually tested every component of the site as I built it by running it in the browser and verifying that users could achieve the functionality they were after. For example when I set up logging in and logging out I manually verified that it worked in several different browsers (Chrome, Opera and Firefox) and when something wasn't working I would fix the problem and then reverify that everything was working in each broswer before moving on to the next stage of functionality. 
* I repeated this process to verify:
   * users can register a new account
   * users can use the timer both with and without registering
   * users can set different times, images and sounds in the timer
   * registered users can upoad their own images to be used in the timer
   * registered users can see their uploaded images in their timer
   * registered users can create diary entries when the timer has finished
   * registered users can see all of their past diary entries in their diary page
   * the navigation links change depending on whether you are logged in or not
   * messages display when users log in and out
   * error messages display when user actions fail (logging in, incorrect card details, wrong passwords, image uploading, not filling in a form)
   * site is responsive on different screen sizes
   * the site can handle multiple logins - I had four seperate accounts logged in at once (two were on phones while two were on laptops)
* I had two people act as test case users to test if they could:
    * Register a new account
    * Log in and out of their account
    * See messages when they logged in and out
    * Change settings in the timer and use it succesfully
    * Play audio sounds when clicking on the audio buttons
    * submit a diary entry after meditating
    * view their diary entry after meditating (or just letting the timer run it's course)

### Automated Testing
* I added test files in each of the apps to test
    * urls
    * views
    * models



-----------------------------

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

* [Square Apple Graphics](https://www.facebook.com/squareapplegraphics) - Site Logo

* [Headers](https://www.freewebheaders.com) and [Focus Images](www.desktopnexus.com)

* [klankbeeld](https://freesound.org/people/klankbeeld/) on www.freesound.org - Ambient Sounds 

* www.freesound.org - Bell sounds released under creative commons

* [Srihari Gopal](https://gist.github.com/gabrielfalcao/6518127) - ascii art (see below)

## Peace and Thanks, Paul
