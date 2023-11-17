function fetchChartData(url, containerId) {
    fetch(url)
        .then(response => response.json())
        .then(jsonData => createChart(containerId, jsonData.data))
        .catch(error => console.error('Error fetching data:', error));
}

function createChart(containerId, data) {
    const chart = LightweightCharts.createChart(document.getElementById(containerId), {
        width: 600,
        height: 400,
        layout: {
            backgroundColor: '#ffffff',
            textColor: '#333',
        },
        rightPriceScale: {
            visible: false,
        },
        timeScale: {
            borderVisible: false,
        },
    });

    // Add a bar series for price data
    const barSeries = chart.addBarSeries({
        upColor: 'rgba(0, 150, 136, 0.8)',
        downColor: 'rgba(255, 82, 82, 0.8)',
    });

    // Add a histogram series for volume data
    const volumeSeries = chart.addHistogramSeries({
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: 'right',
        overlay: true,
    });

    // Format and set the data for the bar and volume series
    const barData = [];
    const volumeData = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const isUpDay = item.close > (i > 0 ? data[i - 1].close : item.open);

        barData.push({
            time: item.date,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            color: isUpDay ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255, 82, 82, 0.8)',
        });

        volumeData.push({
            time: item.date,
            value: item.volume,
            color: isUpDay ? 'rgba(0, 150, 136, 0.5)' : 'rgba(255, 82, 82, 0.5)',
        });
    }

    barSeries.setData(barData);
    volumeSeries.setData(volumeData);

    // Adjusting the volume series scale
    chart.priceScale('right').applyOptions({
        scaleMargins: {
            top: 0.7,  // Adjust this value to control the height of the volume bars
            bottom: 0.00,  // Adjust this value to control the distance from the X-axis
        },
        borderVisible: false,
    });
}

fetchChartData('data.json', 'chartContainer');
