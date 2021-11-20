// <block:actions:2>
// const actions = [
//   {
//     name: 'Randomize',
//     handler(chart) {
//       chart.data.datasets.forEach(dataset => {
//         dataset.data = Utils.bubbles({count: chart.data.labels.length, rmin: 1, rmax: 1, min: 0, max: 100});
//       });
//       chart.update();
//     }
//   },
//   {
//     name: 'Add Dataset',
//     handler(chart) {
//       const data = chart.data;
//       const dsColor = Utils.namedColor(chart.data.datasets.length);
//       const newDataset = {
//         label: 'Dataset ' + (data.datasets.length + 1),
//         backgroundColor: Utils.transparentize(dsColor, 0.5),
//         borderColor: dsColor,
//         data: Utils.bubbles({count: data.labels.length, rmin: 1, rmax: 1, min: 0, max: 100}),
//       };
//       chart.data.datasets.push(newDataset);
//       chart.update();
//     }
//   },
//   {
//     name: 'Add Data',
//     handler(chart) {
//       const data = chart.data;
//       if (data.datasets.length > 0) {

//         for (let index = 0; index < data.datasets.length; ++index) {
//           data.datasets[index].data.push(Utils.bubbles({count: 1, rmin: 1, rmax: 1, min: 0, max: 100})[0]);
//         }

//         chart.update();
//       }
//     }
//   },
//   {
//     name: 'Remove Dataset',
//     handler(chart) {
//       chart.data.datasets.pop();
//       chart.update();
//     }
//   },
//   {
//     name: 'Remove Data',
//     handler(chart) {
//       chart.data.labels.splice(-1, 1); // remove the label first

//       chart.data.datasets.forEach(dataset => {
//         dataset.data.pop();
//       });

//       chart.update();
//     }
//   }
// ];
// </block:actions>

window.onload = function() {
    const datasetLabel = "Test";
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const values = [20, 21, 10, 30, 50, 55, 70];
    const data = {
        labels: labels,
        datasets: [{
            label: datasetLabel,
            data: values,
            borderColor: 'rgb(255,0,2)',
            backgroundColor: 'rgba(255,0,0,0.5)',
        }, ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Test Chart',
                    font: {
                        size: '50px',
                        weight: 'bold',
                    },
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'test',
                        },
                    }]
                }
            }
        },
    };

    var myChart = new Chart("myChart", config);

    $("#chartType").change(function() {
        myChart.destroy();
        config.type = event.target.value;
        myChart = new Chart("myChart", config);
    });
};
