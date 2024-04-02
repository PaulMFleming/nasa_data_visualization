// Define parentWidth function
function parentWidth(elem) {
  return elem.parentElement.clientWidth;
}

// Script to control the graphs on the missions page
queue()
  .defer(d3.json, "/nasaData/missions")
  .await(function(error, data) {
      if (error) {
          console.error('Error loading data:', error);
      } else {
          makeGraphs(null, data);
      }
  });

// set variables
var year_select_width = parentWidth(document.getElementById('dc-year-row-chart'));
var chart_width = parentWidth(document.getElementById('dc-duration-chart'));
var pie_width = parentWidth(document.getElementById('dc-missions-by-country-chart'));

var year_select_element = document.getElementById('dc-year-row-chart');
var positionInfo = year_select_element.getBoundingClientRect();
var year_select_height = positionInfo.height;

var duration_chart_element = document.getElementById('dc-duration-chart');
var positionInfo = duration_chart_element.getBoundingClientRect();
var chart_height = positionInfo.height;
 
var pie_chart_element = document.getElementById('dc-missions-by-country-chart');
var positionInfo = pie_chart_element.getBoundingClientRect();
var pie_height = positionInfo.height;


// functions to control the graphs
function makeGraphs(error, missionsJson) {
    var nasaDataMissions = missionsJson;
    var dateFormat = d3.time.format("%m/%d/%Y");


    nasaDataMissions.forEach(function (d) {
      var parsedDate = dateFormat.parse(d["date"]);
      if (parsedDate) {
        d["date"] = parsedDate.getFullYear();
      } else {
        console.error('Failed to parse date: ' + d["date"]);
      }
      if (!isNaN(d["evanumber"])) { // check if evanumber is a number
        d["evanumber"] = parseInt(d["evanumber"]);
      } else {
        console.error("evanumber is not a number: " + d["evanumber"]);
      }
      if (d["duration"]) {
        var [hours, mins] = d["duration"].split(":");
        d["Hours"] = parseInt(hours) + parseInt(mins) / 60;
      } else {
        console.error('Failed to parse duration: ' + d["duration"]);
      }
    });
    

    // run the data through Crossfilter and load it as 'ndx'
    var ndx = crossfilter(nasaDataMissions);

    // Create dimensions to bind data to crossfilter
    var dateDimension = ndx.dimension(function (d) {
        return d["date"];
    });
    var countryDimension = ndx.dimension(function (d) {
        return d["country"];
    });
    var vehicleDimension = ndx.dimension(function (d) {
        return d["vehicle"];
    });
    var durationDimension = ndx.dimension(function (d) {
        return d["Hours"];
    });
    var yearDimension = ndx.dimension(function(d) {
        return d["date"];
    });


    // Calculate metrics
    var year_total = yearDimension.group().reduceCount(function(d) {return d["date"];});
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
    var minDate = dateDimension.bottom(1)[0]["date"];
    var maxDate = dateDimension.top(1)[0]["date"];
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
            function(d) {return d["evanumber"]},
            function(d) {return d["country"]},
            function(d) {return d["crew"]},
            function(d) {return d["vehicle"]},
            function(d) {return d["vehiclenumber"]},
            function(d) {return d["date"]},
            function(d) {return d["duration"]},
            function(d) {return d["purpose"]}

        ])
        .sortBy(function (d) {
            return d["evanumber"]
        })
        .order(d3.ascending);

    // the following is to help with resizing the graphs
    // I included this as the dc graphs don't like to resize 
    // very well so this is a workaround, it checks if the page
    // has been resized and if it has it reloads the browser
    // and redraws the graphs. 
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