
## Gem D3 : Connected Point Pairs / Arrow Plot

For an input TSV file of x1, y1, x2, and y2 data create connected paoint pairs or arrow plot.

Each row is an arrow that begins at x1,y1 and ends at x2,y2.

<img src="2603-gd3-arrow_plot-01.jpg">

The prompt :

```
Write a Javascript function to generate a d3.js arrow plot or connected point pairs chart for the input data file points_x1y1x2y2.tsv.
The function should take input parameters of input data file name, plot width and plot height.
The chart should consist of n arrows, where each arrow is created by starting the arrow at the x1, y1 columns and end at the arrow at the x2, y2 columns. 
That is each row of data is an arrow.
Generate the JavaScript code and save to file: connected_point_pairs.js.
Also generate an index.html file to call this javascript function. 
Do not start any processes to install or invoke an http server.
```

The example dataset in this case is a perimeter sampled 2D rectangle as the first two columns in the TSV file.

The thrid and fourth columns are 10 degree counter clockwise rotated points in columns one and two.

