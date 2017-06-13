queue()
    .defer(d3.json, "/nasaData/missions")
    .await(makeGraphs);


function makeGraphs(error, missionsJson) {
    var nasaDataMissions = missionsJson;
    var dateFormat = d3.time.format("%Y-%m-%d");
    nasaDataMissions.forEach(function(d) {
       //d["Date"] = dateFormat.parse(d["Date"]);
       //d["Date"].setDate(1);
       d["Country"] = +d["Country"];
    });

    // create a Crossfilter instance
    var ndx = crossfilter(nasaDataMissions);

    // Define data Dimensions
    var countryDim = ndx.dimension(function(d) {
        return d["Country"]; });

    var dateDim = ndx.dimension(function(d) {
        return d["Date"]; });

    var vehicleDim = ndx.dimension(function(d) {
        return d["Vehicle"]; });

    var durationDim = ndx.dimension(function(d) {
        return d["Duration"]; });

    var purposeDim = ndx.dimension(function(d) {
        return d["Purpose"]; });

    var crewDim = ndx.dimension(function(d) {
        return d["Crew"]; });

    // Define data groups
    var all = ndx.groupAll();
    var numMissionsByCountry = countryDim.group();
    var numMissionsByDate = dateDim.group();
    var numMissionsByVehicle = vehicleDim.group();
    var totalMissionsByDuration = durationDim.group();

    var countryChart = dc.rowChart("#country-chart");

    countryChart
        .width(300)
        .height(250)
        .dimension(countryDim)
        .group(numMissionsByCountry)
        .xAxis().ticks(4);


    dc.renderAll();

}