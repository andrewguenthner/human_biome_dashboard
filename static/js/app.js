function buildMetadataItems(sample) {
  // Retrieve info about a particular sample declared in the /metadata/<sample> route

  const routeString = "/metadata/" + sample;
  d3.json(routeString).then(function (metaData) { 
    // Build info panel
    panelTag = d3.select("#sample-metadata");
    panelTag.html("");
    Object.entries(metaData).forEach( ([key, value]) => {
      panelTag.append("p").text(`${key}: ${value}`);

    // Build gauge chart -- modified version of Plotly.js example script
    const level = parseFloat(metaData.WFREQ);
    // Trig to calc meter point, level = 0 -> degrees = 180, level = 9 -> degrees = 0
    const degrees = 180 - 20 * level;
    const radius = 0.5;
    const radians = degrees * Math.PI / 180;
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    const mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    const path = mainPath.concat(pathX,space,pathY,pathEnd);

    let plotData = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'scrubs per week',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      textinfo: 'label',
      textposition:'inside',
      marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(90, 145, 15, .5)',
                            'rgba(130, 177, 30, .5)', 'rgba(170, 183, 64, .5)',
                            'rgba(190, 180, 90, .5)', 'rgba(208, 194, 120, .5)',
                            'rgba(218, 206, 150, .5)', 'rgba(226, 216, 180, .5)',
                            'rgba(232, 226, 202, .5)',
                            'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ' '],
      hoverinfo: 'none',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    let layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', plotData, layout);
    })
  })
}

function buildSamplesCharts(sample) {
  // Retrieve species data from server via /samples/<sample> route, then
  // build three separate charts:  a pie chart with top 10 species, a gauge chart with 
  // scrub frequency, and a bubble chart with species frequency vs. otu id

  const routeString = "/samples/" + sample;
  d3.json(routeString).then( function (speciesObject) {
    // Repackage the raw data -- an object with three arrays -- into a more convenient
    // array of objects and sort this array -- then use either form as needed for plots
    const speciesArray = [];
    speciesObject.otu_ids.forEach( (id, index) => {
        speciesArray.push( {
          otu_id: id,
          sample_value : speciesObject.sample_values[index],
          otu_label : speciesObject.otu_labels[index]
        })
    });
    const sortedSpeciesArray = speciesArray.sort((item1, item2) => item2.sample_value - item1.sample_value);
    // Build top-10 pie chart
    const top10SpeciesArray = sortedSpeciesArray.slice(0,10);

    // Convert back to arrays for plotting
    const top10otu_ids = top10SpeciesArray.map(species => species.otu_id);
    const top10sample_values = top10SpeciesArray.map(species => parseFloat(species.sample_value));
    const top10otu_labels = top10SpeciesArray.map(species => species.otu_label);

    let trace1 = {
      labels : top10otu_ids,
      values : top10sample_values,
      text : top10otu_labels,
      textinfo : "percent",
      type : "pie"
    };
    let plotData = [trace1];
    let layout = {
      title : "Top 10 Species"
    };
    Plotly.newPlot("pie",plotData,layout);

    // Build the bubble plot
    trace1 = {
      x : speciesObject.otu_ids.map(id => parseFloat(id)),
      y : speciesObject.sample_values.map(value => parseFloat(value)),
      text : speciesObject.otu_labels,
      type : "scatter",
      textinfo: "none",
      mode : "markers",
      hoveron : "points",
      marker : {
            size : speciesObject.sample_values.map(value => parseFloat(value)),
            sizemin : 3,
            sizeref : 0.1,
            sizemode : "area",
            color : speciesObject.otu_ids.map(id => parseFloat(id)),
            colorscale : "Earth",
            opacity : 0.5,
            symbol : "circle"
      }
    };
    plotData = [trace1];
    layout = {
      xaxis : {
        title : {
          text : "OTU ID"
        }
      }
    };
    Plotly.newPlot("bubble",plotData,layout);

  })}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    // Because of the difference in app routes, we can build items from each route
    // without having to chain asynchronous events 
    buildSamplesCharts(firstSample);
    buildMetadataItems(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildSamplesCharts(newSample);
  buildMetadataItems(newSample);
}

// Initialize the dashboard
init();
