window.onload = function() {
    const dataEndpoint = "/range";
    var allData = null;

    var chartLoaded = false;
    var chartData = null;
    var chartLayout = null;
    var chartConfig = null;

    var dateLower = 0;
    var dateUpper = 0;

    $('#dateSlider').css('pointer-events', "none");

    var slider = wRunner({
        roots: $('#dateSlider').get(0),
        type: 'range',
        rangeValue: {
            minValue: 0,
            maxValue: 1,
        },
        step: 1,
        direction: 'horizontal',
    });
    slider.onValueUpdate(function() {
        if (chartLoaded) {
            values = slider.getValue();
            dateLower = values["minValue"];
            dateUpper = values["maxValue"];
            if (allData) {
                $(".wrunner__valueNote")[0].innerHTML = allData["timeSet"][dateLower];
                $(".wrunner__valueNote")[1].innerHTML = allData["timeSet"][dateUpper];
                updateChart();
            }
        }
    });
    slider.onLimitsUpdate(function() {
        limits = slider.getLimits();
        slider.setRangeValue({
            'minValue': limits["minLimit"],
            'maxValue': limits["maxLimit"],
        });
        if (allData) {
            $(".wrunner__valueNote")[0].innerHTML = allData["timeSet"][limits["minLimit"]];
            $(".wrunner__valueNote")[1].innerHTML = allData["timeSet"][limits["maxLimit"]];
        }
    });

    function errMsg() {
        var errMsg = $("<div id='errMsg'>ЛИПСВАТ ДАННИ ИЛИ СА НЕВАЛИДНИ &#x2639;</div>");
        errMsg.appendTo(".chart-container");
    }

    function updateLimits(min, max) {
        limits = slider.getLimits();

        if (limits['minLimit'] != min || limits['maxLimit'] != max) {
            slider.setLimits({
                'minLimit': min,
                'maxLimit': max
            });
        }
    }

    function updateChart() {
        $("#errMsg").remove();
        $('#chartType').attr('disabled', false);
        $('#dateSlider').css('pointer-events', "auto");

        chartLoaded = false;
        var type = $('#chartType').find(':selected').attr('value');
        var mode = "lines+markers";
        const labels = allData ? allData["timeSet"].slice(dateLower, dateUpper) : [];
        const values = allData ? allData["level"].slice(dateLower, dateUpper) : [];
        const title = $('#station').find(':selected').text();
        const datasetLabel = $('#airType').find(':selected').text();

        updateLimits(0, allData ? allData["timeSet"].length - 1 : 1);

        if (type == "scattergl") {
            mode = "markers";
        } else if (type == "line") {
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
                },
                title: {
                    text: $('#airType').find(':selected').attr('unit'),
                    font: {
                        family: 'Old Standard TT, serif, bold',
                        size: 24,
                    }
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
                },
                title: {
                    text: 'Период',
                    font: {
                        family: 'Old Standard TT, serif',
                        size: 24,
                    }
                }
            }
        }

        chartConfig = {
            scrollZoom: true,
            responsive: true,
        }

        if (!allData || chartData[0].x.length == 0) {
            errMsg();
            chartConfig.staticPlot = true;
            $('#chartType').attr('disabled', true);
            $('#dateSlider').css({
                'pointer-events': 'none',
                'visibility': 'hidden'
            });
        }

        Plotly.newPlot(myChart, chartData, chartLayout, chartConfig);
        chartLoaded = true;
    };

    function getData() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", dataEndpoint, true);
        xhr.setRequestHeader('Content-Type', 'application-json');
        xhr.send(JSON.stringify({
            'station': $('#station').find(':selected').attr('value'),
            'airType': $('#airType').find(':selected').attr('value'),
        }));
        $("#loading").css("display", "flex");

        xhr.onerror = () => {
            alert("Опа, някой омаза работата.");
            updateChart();
        }

        xhr.onload = () => {
            allData = JSON.parse(xhr.responseText);
            dateLower = 0;
            dateUpper = allData ? allData["timeSet"].length : 1;
            updateChart();
            $("#loading").css("display", "none");
        };
    }

    getData();

    $("#chartType").change(function() {
        updateChart();
    });

    $("#station").change(function() {
        getData();
    });

    $("#airType").change(function() {
        getData();
    });
};
