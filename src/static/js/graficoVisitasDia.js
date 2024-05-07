var options = {
    chart: {
        type: 'area',
        height: 350,  // Altura ajustada
        background: 'transparent',  // Fondo transparente
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
        name: 'Clicks',
        data: Object.values(browserData)
    }],
    xaxis: {
        categories: Object.keys(browserData)
    },
    stroke: {
        curve: 'smooth'  // Líneas spline suavizadas
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
        theme: 'dark'  // Tema oscuro para tooltip
    },
    theme: {
        mode: 'dark'  // Tema oscuro global
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();