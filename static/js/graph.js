queue()
    .defer(d3.json, "/nasaData/missions")
    .await(makeGraphs);


function makeGraphs(error, missionsJson) {
    var nasaDataMissions = missionsJson;
    var dateFormat = d3.time.format("%m/%d/%Y");


    nasaDataMissions.forEach(function (d) {
        d["Date"] = dateFormat.parse(d["Date"]);
        d["EVA #"] = parseInt(d["EVA #"]);
        d["Date"] = d["Date"].getFullYear();
        var [hours, mins] = d["Duration"].split(":");
        d["Hours"] = parseInt(hours) + parseInt(mins) / 60;
    });

    // run the data through Crossfilter and load it as 'ndx'
    var ndx = crossfilter(nasaDataMissions);

    // Create dimensions to bind data to crossfilter
    var dateDimension = ndx.dimension(function (d) {
        return d["Date"];
    });
    var countryDimension = ndx.dimension(function (d) {
        return d["Country"];
    });
    var vehicleDimension = ndx.dimension(function (d) {
        return d["Vehicle"];
    });
    var durationDimension = ndx.dimension(function (d) {
        return d["Hours"];
    });
    var crewDimension = ndx.dimension(function (d) {
        return d["Crew"];
    });
    var yearDimension = ndx.dimension(function(d) {
        return d["Date"];
    });


    // Calculate metrics
    var year_total = yearDimension.group().reduceCount(function(d) {return d["Date"];});
    var countryGroup = countryDimension.group();
    var vehiclesGroup = vehicleDimension.group();
    var dateGroup = dateDimension.group();
    var crewGroup = crewDimension.group();
    var durationGroup = yearDimension.group().reduceSum(function (d) {return d["Hours"];});
    var all = ndx.groupAll();


    // Create the dc.js chart object & link to div
    var dataTable = dc.dataTable("#dc-table-graph");
    var missionsByCountryChart = dc.pieChart("#dc-missions-by-country-chart");
    var missionsByVehicleChart = dc.rowChart("#dc-vehicle-chart");
    var timelineChart = dc.lineChart("#dc-duration-chart");
    var yearRingChart   = dc.pieChart("#chart-ring-year");
    var longestSpacewalksChart = dc.barChart("#dc-longest-spacewalk-chart");
    var totalMissions = dc.numberDisplay("#total-missions");
    var yearRowChart = dc.rowChart("#dc-year-row-chart");
    var totalSpacewalk = dc.numberDisplay("#dc-total-spacewalk");


    //Define values (to be used in charts)
    var minDate = dateDimension.bottom(1)[0]["Date"];
    var maxDate = dateDimension.top(1)[0]["Date"];



    // Define Total Missions Counter
    totalMissions
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

    // Define Total Hours Spacewalking
    totalSpacewalk
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d;})
        .group(durationGroup)

    // Define Current selection indicator
    dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);

    // Define TimeLine Chart
    timelineChart
        .width(700).height(300)
            .dimension(dateDimension)
            .group(dateGroup)
            .x(d3.time.scale().domain([minDate,maxDate]))
            .renderArea(true)
            .brushOn(true)
            .legend(dc.legend().x(450).y(10).itemHeight(13).gap(5))
            .yAxisLabel("Missions per Year")
            .elasticY(true)
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            .xAxisLabel("Year")
            .yAxis().ticks();

    // Define year pie chart
    yearRingChart
        .width(250).height(250)
        .dimension(yearDimension)
        .group(year_total)
        .innerRadius(10)
        .renderLabel(true)
        .legend(dc.legend());

    // Define year row chart
    yearRowChart
        .width(300)
        .height(900)
        .dimension(yearDimension)
        .group(year_total)
        .xAxis().ticks(6);

    // Define Mission by country Pie chart
    missionsByCountryChart
        .width(250)
        .height(250)
        .slicesCap(100)
        .innerRadius(10)
        .dimension(countryDimension)
        .group(countryGroup)
        .legend(dc.legend())
        .renderLabel(true)
        .label(function (d) {
            console.log('label');
            console.log(d)
            return d.key.toUpperCase();
        });

    // Define Space Programs Row Chart
    missionsByVehicleChart
        .width(300)
        .height(300)
        .dimension(vehicleDimension)
        .group(vehiclesGroup)
        .xAxis().ticks(6);

    // Define the Durations Chart
    longestSpacewalksChart
        .width(800)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(durationDimension)
        .group(durationGroup)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxisLabel("Hours")
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .yAxis().ticks(4);


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