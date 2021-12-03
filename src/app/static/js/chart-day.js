window.onload = function() {
    const dataEndpoint = "/day";
    var allData = null;

    var chartLoaded = false;
    var chartData = null;
    var chartLayout = null;
    var chartConfig = null;

    function updateDateRange() {
        $("#datePicker").datepicker('destroy');
        if(allData) {
            $("#datePicker").datepicker({
                autoclose: true,
                todayHighlight: true,
                weekStart: 1,
                daysOfWeekHighlighted: "6,0",
                inline: true,
                format: 'yyyy-mm-dd',
                startDate: new Date(Object.keys(allData).at(0)),
                endDate: new Date(Object.keys(allData).at(-1))
            });
            $("#datePicker").datepicker('setDate', new Date(Object.keys(allData).at(0)))
        }
    }

    function errMsg() {
        var errMsg = $("<div id='errMsg'>ЛИПСВАТ ДАННИ ИЛИ СА НЕВАЛИДНИ &#x2639;</div>");
        errMsg.appendTo(".chart-container");
    }

    function updateChart() {
        $("#errMsg").remove();
        $('#chartType').attr('disabled', false);
        $('#dateSlider').css('pointer-events', "auto");
        console.log(allData);

        chartLoaded = false;
        var type = $('#chartType').find(':selected').attr('value');
        var mode = "lines+markers";
        const date = $("#datePicker").attr('value');
        const labels = allData ? allData[date]["time"] : [];
        const values = allData ? allData[date]["level"] : [];
        const title = $('#station').find(':selected').text();
        const datasetLabel = $('#airType').find(':selected').text();

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
                fixedrange: true,
                ticks: 'outside',
                ticklen: 8,
                tickwidth: 4,
                tickangle: 30,
                tickfont: {
                    family: 'Old Standard TT, serif',
                    size: 20,
                },
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
            updateDateRange();
            updateChart();
            $("#loading").css("display", "none");
        };
    }

    $("#chartType").change(function() {
        updateChart();
    });

    $("#station").change(function() {
        getData();
    });

    $("#airType").change(function() {
        getData();
    });

    $("#datePicker").change(function() {
        $(this).attr('value', $('#datePicker').val());
        updateChart();
    });

    getData()
};
