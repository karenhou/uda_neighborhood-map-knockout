# Neighborhood Map Project
This is a project for udacity full-stack web developer course. It generates predefined markers on Google map. When user clicks on the marker or the list, it randomly request Flickr images with that marker's locations which will display in the infowindow of that marker.

## Requirement
Workable browsers like **Google Chrome**, **Firefox**, or **Safari**,etc.

## Installing
To view the web page, please double click `index.html`

## Built With
* [Knockout Framework](http://knockoutjs.com/)
* [Google Map APIs](https://developers.google.com/maps/documentation/javascript/tutorial)
* [Flickr APIs](https://www.flickr.com/services/api/)

## Acknowledgments
Here are the references I've used during this project

* https://stackoverflow.com/questions/32899466/using-knockout-js-and-google-maps-api

* https://github.com/AanyaP/Neighborhood-Map/blob/master/js/app.js

* https://developers.google.com/maps/documentation/javascript/examples/marker-animations-iteration?hl=zh-tw

* https://stackoverflow.com/questions/14657779/google-maps-bounce-animation-on-marker-for-a-limited-period

* https://www.w3resource.com/API/flickr/tutorial.php#

* https://www.flickr.com/services/api/misc.urls.html

* http://ramblibrarian.blogspot.tw/2016/02/mashing-up-flickr-api-with-google-maps.html

* https://stackoverflow.com/questions/18444161/google-maps-responsive-resize

* https://developers.google.com/maps/documentation/javascript/events

## Known Issues
Flickr API keys seems to expire after a while which will cause infoWindow to unable to load the images from Flickr
