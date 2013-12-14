activemaps
========

This is a repo that uses D3 and leaflet to animate travel surveys, now for the NYMTC Travel Survey and the new California Household Travel Survey.

![sandiego](https://raw.github.com/fscottfoti/batsmaps/master/images/sandiego.jpg)

The survey is visualized in the following way:

* Each dot represents a person from the survey.  The size of the dots are scaled by the age of the person.  Because of these scaling, sometimes you can see parents (big dot) moving with their children (small dot).
* There is a time slider which can move time through a 24 hour period. from 1AM to 12AM the next day.  In this way, the travel survey day(s) are visualized moving through time.  Moving the time slider uses D3 to **animate** the positions of the people in the survey.
* The mode of the most recent trip is used to color the circle representing each person.  Note that "home" is also used as a default mode for people that haven't left home yet and so aren't yet assigned a mode.
* The income classifications and active region can be modified with drop down menus.

![bayarea](https://raw.github.com/fscottfoti/batsmaps/master/images/bayarea.jpg)

**I strongly encourage setting up a new region for the region you live in and the data you're interested in**.

The data format used by activemaps is extremely simple and an example few records is shown below.  Simply include household id, person id, age, mode of trip, the arrival hour and the longitude-latitude for the location.  Use the correct field names and batsmaps will use it automatically or email if you have trouble.  

```
HHID,PERID,AGE,MODE,ARR_HR,XCORD,YCORD
1037752,1,45,6.0,5,-120.138422606053,39.46786662801739
1037752,1,45,3.0,9,-120.238422606053,38.48786662801739
```

Note that I name the files with the income category in the file name in order to get the drop down to work.  Search for `d3.csv` in `index.html` and adjust the filename as needed.  Also you might need to change lat-long for the bounding box (search for `bounds` in `index.html`) and the map centers for each region (search for `centerd` in `index.html`).

_Really, if you get the data formatted, I will add the region to the current set of regions._

![losangeles](https://raw.github.com/fscottfoti/batsmaps/master/images/losangeles.jpg)

============================

shapes.html is used to visualize the travel surveys as aggregate shapes - for the Bay Area this uses census tracts.

This map allows you to hover over the home tract and see the distribution of tracts (sum of trips) visited by people in that tract.

http://WEBROOT/activemaps/shapes.html

This map allows you to hover over the work tract and see the distribution of tracts (sum of people) that work in that tract.

http://WEBROOT/activemaps/shapes.html?file=bayarea_chts_worktractvolume

The following two links do the same thing for "superdistrict" geography instead of tracts:

http://localhost:63342/activemaps/shapes_sd.html
http://localhost:63342/activemaps/shapes_sd.html?file=bayarea_chts_worktractvolume

This link allows you to see a custom created segment in activemaps (in this case the segment is the city of Ecatapec in Mexico city).

http://WEBROOT/activemaps/index.html?region=mexicocity&segment=ecatepec

