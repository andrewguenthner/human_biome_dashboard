function buildMetadata(sample) {
  console.log(sample);
  routeString = "metadata/" + sample;
  console.log(routeString);
  d3.json(routeString, function (metaData)  { 
    console.log("hello again");
    panelTag = d3.select("#sample-metadata");
    panelTag.html("");
    console.log(metaData);
    console.log("hello");
    Object.entries(metaData).forEach( ([key, value]) => {
      console.log('${key} hello');
      panelTag.append("p").text("${key}: ${value}")
    })
  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
