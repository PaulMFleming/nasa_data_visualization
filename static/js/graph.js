queue()
    .defer(d3.json, "/nasaData/missions")
    .await(makeGraphs);

function parentWidth(elem) {
    return elem.parentElement.clientWidth;
}

var year_select_width = parentWidth(document.getElementById('dc-year-row-chart'));
chart_width = parentWidth(document.getElementById('dc-duration-chart'));
pie_width = parentWidth(document.getElementById('dc-missions-by-country-chart'));

year_select_element = document.getElementById('dc-year-row-chart');
positionInfo = year_select_element.getBoundingClientRect();
year_select_height = positionInfo.height;

duration_chart_element = document.getElementById('dc-duration-chart');
positionInfo = duration_chart_element.getBoundingClientRect();
chart_height = positionInfo.height;

pie_chart_element = document.getElementById('dc-missions-by-country-chart');
positionInfo = pie_chart_element.getBoundingClientRect();
pie_height = positionInfo.height;

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
    var yearDimension = ndx.dimension(function(d) {
        return d["Date"];
    });


    // Calculate metrics
    var year_total = yearDimension.group().reduceCount(function(d) {return d["Date"];});
    var countryGroup = countryDimension.group();
    var vehiclesGroup = vehicleDimension.group();
    var dateGroup = dateDimension.group();
    var durationGroup = yearDimension.group().reduceSum(function (d) {return d["Hours"];});
    var totalDurationGroup = durationDimension.group().reduceSum(function(d) {return d["Hours"];});
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
    var average = function(d) {return d.n ? d.tot / d.n : 0;};



    // Define Total Missions Counter
    totalMissions
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

    // Define Total Hours Spacewalking
    totalSpacewalk
        .valueAccessor(function(d){return +d["Hours"];})
        .group(totalDurationGroup)
        .formatNumber(d3.format("d"));


    // Define Current selection indicator
    dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);

    // Define TimeLine Chart
    timelineChart
        .width(chart_width)
        .height(chart_height)
        .dimension(dateDimension)
        .group(dateGroup)
            .x(d3.scale.linear().domain([minDate,maxDate]))
            .renderArea(true)
            .brushOn(true)
            //.legend(dc.legend().x(450).y(10).itemHeight(13).gap(5))
            .yAxisLabel("Number of Missions")
            .elasticY(true)
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            .xAxisLabel("Year")
            .yAxis().ticks();

    // Define year pie chart
    yearRingChart
        .width(pie_width).height(pie_height)
        .dimension(yearDimension)
        .group(year_total)
        .innerRadius(10)
        .renderLabel(true)
        .legend(dc.legend());

    // Define year row chart
    yearRowChart
        .width(year_select_width)
        .height(600)
        .dimension(yearDimension)
        .group(year_total)
        .xAxis().ticks(6);

    // Define Mission by country Pie chart
    missionsByCountryChart
        .width(200)
        .height(200)
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

    // Define Space Programs Row Chart
    missionsByVehicleChart
        .width(pie_width)
        .height(pie_height)
        .dimension(vehicleDimension)
        .group(vehiclesGroup)
        .xAxis().ticks(6);

    // Define the Durations Chart
    longestSpacewalksChart
        .width(chart_width)
        .height(chart_height)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(durationDimension)
        .group(durationGroup)
        .transitionDuration(500)
        .x(d3.scale.linear().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("Year")
        .yAxisLabel("Number of Hours")
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .brushOn(false)
        .yAxis().ticks(4);


    // Define the table
    dataTable.width(chart_width).height(800)
        .dimension(dateDimension)
        .group(function (d) { return ""})
        .size(375)
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


    var resizeTimer;

    $(window).on('resize', function(e) {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {

        dataTable.width(chart_width).height(chart_height);

        longestSpacewalksChart.width(chart_width).height(chart_height);

        missionsByVehicleChart.width(pie_height).height(pie_height);

        missionsByCountryChart.width(chart_width).height(chart_height);

        yearRowChart.width(year_select_width).height(600);

        yearRingChart.width(year_select_width).height(year_select_height);

        timelineChart.width(chart_width).height(chart_height);


        window.location.reload();

    }, 250);

    });


    dc.renderAll();

}