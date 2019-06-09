This dashboard currently runs on Heroku at:

guenthner-biome-1.herokuapp.com

The Heroku app will take several seconds to "wake up" if the site has not been
accessed in awhile, so please be patient.

The site is a demonstration of a dashboard created using d3.js from data stored
internally in a simple sqlite database.  The data concerns microbiome 
analyses of anonymous subjects.  The dropdown menu enables selection of individual
subject data sets, with metadata displayed and three visualizations:  a pie
chart for the top ten species ("species" in this context can encompass more than
one biological species, but represents a distinct biome signature), a gauge 
chart showing the scurb frequency, and a bubble plot showing all "species"
present.  

This project is being done as a quick way to get started with d3.js and 
dashboarding.  I am undertaking the project as a prelude to more sophisticated
efforts, including the Hansen Solubility Parameter project, which can make
use of d3.js for custom visualizations.  Because I am scheduled to present
the Hasnen Solubility Parameter project is late August, these preliminary
demos need to be completed now.

The app has been tested on Chrome.  It will display on Android phones with
only minor visual disturbances.  Otherwise, it has not been tested but
should work with browsers that have enabled Javascript.  
