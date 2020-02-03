# LaserBeam


[live site](https://ladydragonforever.github.io/LaserBeam/page.html)


## Background

LazerBeam is a data visualization project showing the third party requests on the websites we are visiting.

The project is inspired from an open source project created by Mozilla in 2013 to help users understand the array of first and third party companies people interact with every day across the Web. It also educates users about the third-party trackers active on the websites they are browsing, in a perspective of data privacy. The project was deprecated in 2019. I really like the project and want to make a better version of it in terms of data visualization.

## Functionality and MVP

There are three MVPs:
- Filter: user can select and unselect any companies and see instant changes in the network graph; users can select or unselect all the companies by clicking on the "Select All/Unselect" button.
- Network Graph: The center nodes represent the first party websites and the surronding nodes represent the third party trackers. The network graph is interactive. 
  * Users can drag and drop the nodes and move the graph around
  * while hovering on the center node, its linked third-party tracker names will appear
  * while clicking on the center node, the website and its linked third-party trackers will light up - just like a laser beam!
  * the nodes & links & texts of the network graph are contained in a SVG box with boudaries
- Barchart: 
  * The barchart represents the number of trackers on ten popular webistes we browse. 
  * While hovering on the bar, a yellow line will apear and show the divergence.
 
## Highlights
  
  Here is a hight-level diagram of the final project that should look like:
  
  ![alt text](https://github.com/ladydragonforever/LaserBeam/blob/master/LazerBeam.png)
  
## Architecture and Technologies
 LaserBeam is a frontend Javascript project. The main technologies used are :
  * JavaScript
  
  * D3
  
  * HTML5
  
  * CSS
