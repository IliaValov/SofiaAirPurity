window.onload = function() {
    const dataEndpoint = "/data";
    var chartType = $("#chartType").get(0);
    var station = $("#station").get(0);
    var airType = $("#airType").get(0);
    var allData = null;

    var myChart = $("#myChart").get(0);
    var chartData = null;
    var chartLayout = null;
    var chartConfig = null;

    function errMsg() {
        var errMsg = $("<div id='errMsg'>ЛИПСВАТ ДАННИ ИЛИ СА НЕВАЛИДНИ &#x2639;</div>");
        $(".chart-container").get(0).appendChild(errMsg.get(0));
    }

    function updateChart() {
        const type = chartType.value;
        var mode = "lines+markers";
        const labels = allData ? allData["labels"] : [];
        const values = allData ? allData["values"] : [];
        const title = station.options[station.selectedIndex].text;
        const datasetLabel = airType.options[airType.selectedIndex].text;

        if (type == "scatter") {
            mode = "markers";
        }

        chartData = [
            {
                name: datasetLabel,
                x: labels,
                y: values,
                type: type,
                mode: mode,
                marker: {
                    size: 10,
                }
            }
        ];

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
            }
        }

        chartConfig = {
            scrollZoom: true,
            responsive: true,
        }
    };

    function drawChart() {
        $("#errMsg").remove();
        if (!allData || chartData[0].x.length == 0) {
            errMsg();
        }

        Plotly.newPlot(myChart, chartData, chartLayout, chartConfig);
    } 

    function getData(station, airType) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", dataEndpoint, true);
        xhr.send();
        xhr.onerror = () => {
            alert("Опа, някой омаза работата.");
            updateChart();
        }

        xhr.onload = () => {
            allData = JSON.parse(xhr.responseText);
            updateChart();
            drawChart();
        };
    }

    getData(station.value, airType.value)

    $("#chartType").change(function() {
        updateChart();
        drawChart();
    });

    $("#station").change(function() {
        getData(station.value, airType.value);
    });

    $("#airType").change(function() {
        updateChart();
        drawChart();
    });
};
