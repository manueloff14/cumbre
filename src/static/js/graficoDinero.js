document.addEventListener('DOMContentLoaded', function () {
    var options = {
        chart: {
            type: 'area',
            height: 350,
            background: 'transparent',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            }
        },
        series: [{
            name: 'Clicks por Día',
            data: clicksPorDiaValues
        }],
        xaxis: {
            categories: clicksPorDiaLabels
        },
        stroke: {
            curve: 'smooth'
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100]
            }
        },
        tooltip: {
            theme: 'dark'
        },
        theme: {
            mode: 'dark'
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
});