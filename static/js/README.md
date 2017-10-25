![picture alt](https://s3-eu-west-1.amazonaws.com/imom-assets/static/media/images/imomlogo.png "Im.Om Logo")

# Spacewalking Data Visualization

> This project is a data visualization of a Nasa database.
> It runs on Python and makes use of Javascript libraries
> to build the graphs.


## Usage


### User Accounts
* You can use the site without registering, however you don't get all of the functions unless you register (see table below)
* Registering will eventually cost €2.50 to signup but as the site is still in testing you can register for free using:
    * the test visa number 4242 4242 4242 4242
    * 123 for the CVV
    * any expiry date set in the future

Function      |   Annonymous User     |    Registered User
------------- | --------------------- | --------------------------------------------
Meditation Timer | yes | yes
Meditation Guide | yes | yes
Diary | no | yes
Extra Images & Audio | no | yes
Custom Focus Images | no | yes


### Meditation Timer
This is the main focus of this site. In the timer you can change and set the following:
* __Prep Time -__       how long you need to get comfortable and ready to begin meditating.
* __Meditation Time -__ how long you want to meditate for
* __Bell Sound -__      this will play three times:
    * At the start of your preperartion time
    * At the start of your meditation time
    * At the end of your meditation time
* __Ambient Sound -__ this can be left as either no-sound or you can select from one of the ambient nature sounds provided. The ambient sound will play for the duration of the meditation.
* __Focus Image -__ this is a dark background by default but you can choose from the provided images or upload your own if you register an account. Focus Images are often used as a focus or anchor point in meditation.

### Meditation Diary
The diary is where you can record how you felt during your meditations. You can save them and read them back later at any time.
* __Note -__ You can only write in your diary __after you've finished meditating.__ This is done on purpose so as to avoid distractions.
--------------------------------------------------------------------------------------------------------------------------

## Build

### Base Dependencies
Technology | Version | Reason For Use
--------- | --------| ------------------
Django | 1.11.6 | The MVC Framework built on Python used for it's seamless connection and integration with databases (SQL on this site), it's scalabilty and ease of maintenance. Django also handles user authentication and management easily out of the box.Also, I plan to add more features to this site in the future and Django is perfect for this reason.
Bootstrap | 3.3.7 | I used Bootstrap for it's ease of use paricularly in the areas of responsive layout so that the site looks good on all screen sizes. Bootstrap also speeds up development time particularly with things like navigation and pop-up modals
Django Forms Bootstrap | 3.1.0 | Used for it's great styling of forms to imporve User Experience
JQuery | 3.2.1 | Used ontop of native Javascript to build the meditation timer, play audio files, set the timer background images and other settings. I also used JQuery to validate credit card details.
Stripe | 1.69.0 | Used to process payments over the web in a safe and secure way. 
Amazon S3 | | I used Amazon S3 services to store my static files (css, javascript and default image and audio files) and the media files (user uploaded content). I used Amazon S3 for this purpose due to it's security and strength of service. I plan to develop this site further nd have more options available to users that they can upload, so for this reason S3 was a perfect choice
S3 Transfer |0.1.11 | Used to transfer static and media files to Amazon S3 service 
Django Storages | 1.6.5 | Custom backend storage library used in conjunction with Amazon S3
Boto 3 | 1.4.7 | This is Amazon Web Services SDK for Python that allows us to write python code to work with S3
Pillow | 4.3.0 | Python library for working with images

* Note several other various smaller backend libraries were used which can be seen in the requirements directory

### Dev Dependencies
Technology | Version | Reason For Use
--------- | --------| ------------------
Django Debug Toolbar | | The Django debug toolbar is extremeley useful when  developing to find any bugs and figure out what's going on in your code

### Staging Dependencies
Technology | Version | Reason For Use
--------- | --------| ------------------
MySQL Python |    | Python SQL Interface for working with the database
Dj Database Url | 0.2.1 | Makes it easier to work with URLs in Django
Guincorn | 19.4 | Python Web Server Gateway Interface for working with Heroku

### Deployment
* The site is deployed on [heroku](www.heroku.com) and uses [AWS S3](https://aws.amazon.com/s3/) for data storage.

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

           ________          .
         ,88888PP8ba,  8b   d8b    d8b'
       ,d8P"      "Y8b I8   888   d88b'
       a8"         'Yd  Yb  "*" ,ad8"
       "            )8   "8aaaaa8b"
                   ,dP     """"""
                  ,a8"   ________
          "8gggggg88I  ,d88888888b,
           "8'    'a8b,88"      "Y8)
                   "Y8b'          d8)
                    'Ydb         ,88'
                     )8b         d88'
     8(b             ,dP        (8P'
     "I8            ,a8"       d88'
       Yb,_________,a8"'Y8b  ,ad8"
        "8ggggggggg8"   'Y88888Y"
           """"""""       """"'

