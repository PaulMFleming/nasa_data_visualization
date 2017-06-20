queue()
    .defer(d3.json, "/nasaData/missions")
    .await(makeGraphs);


function makeGraphs(error, missionsJson) {
    var nasaDataMissions = missionsJson;
    var dateFormat = d3.time.format("%m/%d/%Y");


    nasaDataMissions.forEach(function (d) {
        d["Date"] = dateFormat.parse(d["Date"]);
        d["EVA #"] = parseInt(d["EVA #"]);

    });

    // run the data through Crossfilter and load it as 'ndx'
    var ndx = crossfilter(nasaDataMissions);

    // Create dataTable dimension
    var dateDimension = ndx.dimension(function (d) {
        return d["Date"];
    });
    var countryDimension = ndx.dimension(function (d) {
        return d["Country"];
    });
    var vehicleDimension = ndx.dimension(function (d) {
        return d["Vehicle"];
    });
    var crewDimension = ndx.dimension(function (d) {
        return d["Crew"];
    })

    var all = ndx.groupAll();

    // Calculate metrics
    var countryGroup = countryDimension.group();
    var vehiclesGroup = vehicleDimension.group();
    var dateGroup = dateDimension.group();




    // Create the dc.js chart object & link to div
    var dataTable = dc.dataTable("#dc-table-graph");
    var missionsByCountryChart = dc.pieChart("#dc-missions-by-country-chart");
    var missionsByVehicleChart = dc.rowChart("#dc-vehicle-chart");
    var totalMissionsByCountryChart = dc.lineChart("dc-total-missions-by-country-chart");


    //Define values (to be used in charts)
    var minDate = dateDimension.bottom(1)[0]["Date"];
    var maxDate = dateDimension.top(1)[0]["Date"];



    // Define the charts

    dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);

    totalMissionsByCountryChart
        .width(600)
        .height(220)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dateDimension)
        .group(dateGroup)
        .renderArea(true)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .xAxisLabel("Year")
        .yAxis().ticks(6);

    missionsByCountryChart
        .width(500)
        .height(300)
        .slicesCap(100)
        .innerRadius(10)
        .dimension(countryDimension)
        .group(countryGroup)
        .renderLabel(true)
        .label(function (d) {
            console.log('label');
            console.log(d)
            return d.key.toUpperCase();
        });


    missionsByVehicleChart
        .width(350)
        .height(350)
        .dimension(vehicleDimension)
        .group(vehiclesGroup)
        .xAxis().ticks(6);


    // Define the table
    dataTable.width(800).height(800)
        .dimension(dateDimension)
        .group(function (d) { return ""})
        .size(50)
        .columns([
            function(d) {return d["EVA #"]},
            function(d) {return d["Country"]},
            function(d) {return d["Crew"]},
            function(d) {return d["Vehicle"]},
            function(d) {return d["Model #"]},
            function(d) {return d["Date"]},
            function(d) {return d["Duration"]},
            function(d) {return d["Purpose"]}

        ])
        .sortBy(function (d) {
            return d["EVA #"]
        })
        .order(d3.ascending);


    dc.renderAll();

}