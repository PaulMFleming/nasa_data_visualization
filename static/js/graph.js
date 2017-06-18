queue()
    .defer(d3.json, "/nasaData/missions")
    .await(makeGraphs);


function makeGraphs(error, missionsJson) {
    var nasaDataMissions = missionsJson;
    var dateFormat = d3.time.format("%m/%d/%Y");
    
    nasaDataMissions.forEach(function (d) {
        d["Date"] = dateFormat.parse(d["Date"]);
    });

    // run the data through Crossfilter and load it as 'ndx'
    var ndx = crossfilter(nasaDataMissions);

    // Create dataTable dimension
    var timeDimension = ndx.dimension(function (d) {
        return d["Date"];
    });


    // Create the dc.js chart object & link to div
    var dataTable = dc.dataTable("#dc-table-graph");


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
            return d["Date"]
        })
        .order(d3.ascending);

    dc.renderAll();

}