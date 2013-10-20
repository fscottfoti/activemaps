batsmaps
========

This is a repo that uses D3 and leaflet to animate travel surveys, in this case the new California Household Travel Survey.  Unfortunately, at this point I'm still wrestling with the privacy policy so I can't share it as a functional website.  Nonetheless, the code works fully and I'm looking for another travel survey or similar data with lat-long data over time that I can use with this (at the moment I'm thinking about using the New York travel survey for this purpose).

![sandiego](https://raw.github.com/fscottfoti/batsmaps/master/images/sandiego.jpg)

The survey is visualized in the following way:

* Each dot represents a person from the survey.  The size of the dots are scaled by the age of the person.
* There is a time slider which can move time from 1AM to 12AM the next day.  In this way, the travel survey day(s) are visualized moving through time.  Moving the time slider uses D3 to **animate** the positions of the people in the survey.
* The mode of the most recent trip is used to color the circle representing each person.  Note that "home" is also used as a default mode for people that haven't left home yet and so aren't yet assigned a mode.
* The income classifications and 

![bayarea](https://raw.github.com/fscottfoti/batsmaps/master/images/bayarea.jpg)

![losangeles](https://raw.github.com/fscottfoti/batsmaps/master/images/losangeles.jpg)
