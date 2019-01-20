$(document).ready(function () {
    $("#textarea-submit").submit(function (e) {
        e.preventDefault();
        $("#result-panel").empty();
        var userSubmitedContent = $("#textarea-submit textarea").val().toUpperCase();
        const data = [];
        var letterCountDict = {
            "non-alphabet": 0
        };

        for (let i = 0; i < userSubmitedContent.length; i++) {
            if (userSubmitedContent[i].match(/[a-z]/i)) {
                if (letterCountDict.hasOwnProperty(userSubmitedContent[i]) === false) {
                    letterCountDict[userSubmitedContent[i]] = 1;
                } else {
                    letterCountDict[userSubmitedContent[i]]++;
                }
            } else {
                letterCountDict["non-alphabet"]++;
            }
        }

        for (var key in letterCountDict) {
            var eachObject = {};
            eachObject.letter = key;
            eachObject.count = letterCountDict[key];
            data.push(eachObject);
        }

        console.log(data);

        horizontalBar(data);
    });

    function horizontalBar(data) {
        var margin = {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
        };
    
        var barSize = {
            height: 20
        }
    
        var width = 400 - margin.left - margin.right;
        var height = 400 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        var svg = d3.select("#result-panel").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        x.domain([0, d3.max(data, function (d) { return d.count })]);
        y.domain(data.map(function (d) { return d.letter }));
        y.paddingInner(0.5);

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("text")
            .text(function (d) { return d.count; })
            .attr("x", function (d) { return x(d.count) + 10; })
            .attr("y", function (d, i) { return height - (( height / data.length ) * (1 / 3)) - (( height / data.length ) * i ); });

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("width", function (d) { return x(d.count) })
            .attr("y", function (d) { return y(d.letter) })
            .attr("height", y.bandwidth());

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));
    }
});