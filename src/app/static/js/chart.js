window.onload = function() {
    const dataEndpoint = "/";
    var chartType = $("#chartType").get(0);
    var station = $("#station").get(0);
    var airType = $("#airType").get(0);
    var allData = null;

    var myChart = $("#myChart").get(0);
    var chartLoaded = false;
    var chartData = null;
    var chartLayout = null;
    var chartConfig = null;

    var dateLower = 0;
    var dateUpper = 0;
    var dateSlider = $("#dateSlider").get(0);
    dateSlider.style.pointerEvents = "none";

    var slider = wRunner({
        roots: dateSlider,
        type: 'range',
        rangeValue: {
            minValue: 0,
            maxValue: 1,
        },
        step: 1,
        direction: 'vertical',
    });
    slider.onValueUpdate(function() { 
        if (chartLoaded) {
            values = slider.getValue();
            dateLower=values["minValue"];
            dateUpper=values["maxValue"];
            $(".wrunner__valueNote")[0].innerHTML=allData["timeSet"][dateLower];
            $(".wrunner__valueNote")[1].innerHTML=allData["timeSet"][dateUpper];
            updateChart();
        }
    });
    slider.onLimitsUpdate(function() {
        limits = slider.getLimits();
        slider.setRangeValue({ 
            'minValue': limits["minLimit"], 
            'maxValue': limits["maxLimit"], 
        });
        $(".wrunner__valueNote")[0].innerHTML=allData["timeSet"][limits["minLimit"]];
        $(".wrunner__valueNote")[1].innerHTML=allData["timeSet"][limits["maxLimit"]];
    });

    function errMsg() {
        var errMsg = $("<div id='errMsg'>ЛИПСВАТ ДАННИ ИЛИ СА НЕВАЛИДНИ &#x2639;</div>");
        $(".chart-container").get(0).appendChild(errMsg.get(0));
    }

    function updateLimits(min, max) {
        limits = slider.getLimits();

        if (limits['minLimit']!=min || limits['maxLimit']!=max) {
            slider.setLimits({ 
                'minLimit': min, 
                'maxLimit': max 
            });
        }
    }

    function updateChart() {
        chartLoaded = false;
        var type = chartType.value;
        var mode = "lines+markers";
        const labels = allData ? allData["timeSet"].slice(dateLower, dateUpper) : [];
        const values = allData ? allData["level"].slice(dateLower, dateUpper) : [];
        const title = station.options[station.selectedIndex].text;
        const datasetLabel = airType.options[airType.selectedIndex].text;

        updateLimits(0, allData ? allData["timeSet"].length-1 : 1);

        if (type == "scattergl") {
            mode = "markers";
        }
        else if (type == "line") {
            type = 'scattergl';
        }

        chartData = [{
            name: datasetLabel,
            x: labels,
            y: values,
            type: type,
            mode: mode,
            marker: {
                size: 10,
            }
        }];

        chartLayout = {
            autosize: true,
            title: title,
            showlegend: true,
            legend: {
                x: 1,
                xanchor: 'right',
                yanchor: 'top',
                y: 1,
            },
            font: {
                size: 30,
            },
            yaxis: {
                fixedrange: true,
                ticks: 'outside',
                ticklen: 8,
                tickwidth: 4,
                tickangle: 0,
                tickfont: {
                    family: 'Old Standard TT, serif',
                    size: 20,
                }
            },
            xaxis: {
                ticks: 'outside',
                ticklen: 8,
                tickwidth: 4,
                tickangle: 0,
                tickfont: {
                    family: 'Old Standard TT, serif',
                    size: 20,
                }
            }
        }

        chartConfig = {
            scrollZoom: true,
            responsive: true,
        }

        $("#errMsg").remove();
        chartType.disabled = false;
        dateSlider.style.pointerEvents = "auto";

        if (!allData || chartData[0].x.length == 0) {
            errMsg();
            chartConfig.staticPlot = true;
            chartType.disabled = true;
            dateSlider.style.pointerEvents = "none";
        }

        Plotly.newPlot(myChart, chartData, chartLayout, chartConfig);
        chartLoaded=true;
    };

    function getData(station, airType) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", dataEndpoint, true);
        xhr.setRequestHeader('Content-Type', 'application-json');
        xhr.send(JSON.stringify({
            'station': station,
            'airType': airType
        }));
        xhr.onerror = () => {
            alert("Опа, някой омаза работата.");
            updateChart();
        }

        xhr.onload = () => {
            allData = JSON.parse(xhr.responseText);
            dateLower = 0;
            dateUpper = allData ? allData["timeSet"].length : 1;
            updateChart();
        };
    }

    getData(station.value, airType.value)

    $("#chartType").change(function() {
        updateChart();
    });

    $("#station").change(function() {
        getData(station.value, airType.value);
    });

    $("#airType").change(function() {
        getData(station.value, airType.value);
    });
};
