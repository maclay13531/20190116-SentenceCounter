$(document).ready(function () {
    $(".clear-text-button").click(function () {
        $(".text-area").val("");
    })

    $("#textarea-submit").submit(function (e) {
        e.preventDefault();
        $("#letter-count-bar-chart").empty();
        $("#letter-count-donut-chart").empty();
        $(".bar-chart-image").attr("hidden", true);
        $(".pie-chart-image").attr("hidden", true);

        var userSubmitedContent = $("#textarea-submit textarea").val().toUpperCase();

        const barChartData = [];
        const pieChartData = [];

        var letterCountDict = {
            "non-alphabet": 0
        };
        var vowelAndConsonentDict = {   
            "Vowel": 0,
            "Non-Vowel": 0
        }

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
            barChartData.push(eachObject);
        }

        for (let j = 0; j < userSubmitedContent.length; j++) {
            if (userSubmitedContent[j].match(/^[aeiou]$/i)) {
                vowelAndConsonentDict["Vowel"]++;
            } else {
                vowelAndConsonentDict["Non-Vowel"]++;
            }
        }

        for (var key in vowelAndConsonentDict) {
            var eachObject = {};
            eachObject.type = key;
            eachObject.count = vowelAndConsonentDict[key];
            pieChartData.push(eachObject);
        }

        console.log(vowelAndConsonentDict);
        console.log(barChartData);

        horizontalBarChart(barChartData);
        donutChart(pieChartData);
    });

    function horizontalBarChart(data) {
        var margin = {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
        };

        var width = 300 - margin.left - margin.right;
        var height = 420 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        var svg = d3.select("#letter-count-bar-chart").append("svg")
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
            .attr("y", function (d, i) { return height - ((height / data.length) * (1 / 3)) - ((height / data.length) * i); });

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

    function donutChart(data) {
        var width = 250;
        var height = 250;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 50;
        var legendRectSize = 20;
        var legendSpacing = 10;

        var color = d3.scaleOrdinal()
            .range(["#173753", "#6daedb"]);

        var svg = d3.select("#letter-count-donut-chart")
            .append("svg")
            .attr("width", width )
            .attr("height", height + 150)
            .append("g")
            .attr("transform", "translate(" + (width / 2) + "," + (height) + ")");

        var arc = d3.arc()
            // .innerRadius(0)
            .innerRadius(radius - donutWidth)
            .outerRadius(radius);

        var pie = d3.pie()
            .value(function (d) { return d.count; })
            .sort(null);

        var path = svg.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", function (d, i) {
                return color(d.data.type);
            });

        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .style("fill", color)
            .style("stroke", color);

        legend.append('text')
            .style("stroke", color)
            .attr("x", (legendRectSize + legendSpacing) * 3)
            .attr("y", legendRectSize - legendSpacing + 2)
            .text(function (d) { return d.toUpperCase(); });
    }
});