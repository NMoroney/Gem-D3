
## Gem D3 : Multi-Line Chart

Create a multi-line chart based on red, green and blue spectra of Macbeth Colorchecker.

[MCSL Data](https://www.rit.edu/science/munsell-color-science-lab-educational-resources) and [Macbeth Colorchecker spreadsheet](https://www.rit-mcsl.org/UsefulData/MacbethColorChecker.xls).

<img src="2603-gd3-multi_line_chart-01.jpg" width=400px>

The prompt :

```
Write a Javascript function to generate a d3.js multi line chart for the input data file Macbeth.tsv.
The function should take input parameters of input data file name, plot width and plot height.
The first column (or nanometers) should be used for the x-axis values.
The remaining columns (or columns not named nanometers) should be used for the y-axis values.
Each of the y-axis columns should be plotted as its own line, it should only be stroked color and not filled.
Generate the JavaScript code and save to file: multi_line_chart.js.
Also generate an index.html file to call this javascript function. 
Do not start any processes to install or invoke an http server.
```

