queue()
    .defer(d3.json, "/nasaData/missions")
    .await(makeGraphs);


function makeGraphs(error, missionsJson) {
    var nasaDataMissions = missionsJson;
    var dateFormat = d3.time.format("%m/%d/%Y");
    
    nasaDataMissions.forEach(function (d) {
        d["Date"] = dateFormat.parse(d["Date"]);
        d["EVA#"] = parseInt(d["EVA#"]);
    });

    // run the data through Crossfilter and load it as 'ndx'
    var ndx = crossfilter(nasaDataMissions);

    // Create dataTable dimension
    var timeDimension = ndx.dimension(function (d) {
        return d["Date"];
    });
    var countryDimension = ndx.dimension(function (d) {
        return d["Country"];
    });
    var vehicleDimension = ndx.dimension(function (d) {
        return d["Vehicle"];
    });


    // Calculate metrics
    var numMissionsByCountry = countryDimension.group();
    var totalVehicles = vehicleDimension.group();


    // Create the dc.js chart object & link to div
    var dataTable = dc.dataTable("#dc-table-graph");
    var missionsByCountryChart = dc.barChart("#dc-missions-by-country-chart");
    var missionsByVehicleChart = dc.barChart("#dc-vehicle-chart");

    var all = ndx.groupAll();

    // Define the bar chart
    missionsByCountryChart
        .width(500)
        .height(300)
        .margins({top: 10, right: 50, bottom: 50, left: 30})
        .dimension(countryDimension)
        .group(numMissionsByCountry)
        .transitionDuration(500)
        .x(d3.time.scale().domain([0, 100]))
        .elasticY(true)
        .xAxisLabel("Country")
        .yAxis().ticks(4);


    // Define the table
    dataTable.width(800).height(800)
        .dimension(timeDimension)
        .group(function (d) { return ""})
        .size(50)
        .columns([
            function(d) {return d["EVA#"]},
            function(d) {return d["Country"]},
            function(d) {return d["Crew"]},
            function(d) {return d["Vehicle"]},
            function(d) {return d["Date"]},
            function(d) {return d["Duration"]},
            function(d) {return d["Purpose"]}

        ])
        .sortBy(function (d) {
            return d["EVA#"]
        })
        .order(d3.ascending);

    dc.renderAll();

}