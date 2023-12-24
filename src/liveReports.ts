//import { Chart } from 'chart.js';
import { coinsFlexSwitchSelected } from './state.js';
//import * as $ from 'jquery';
//import  { Chart }    from 'chart.js';
declare var Chart: any;

// This function should be called when the "Live Reports" tab is selected
export default function startDataFetchAndUpdate() {
    console.log('startDataFetchAndUpdate');
    console.log(coinsFlexSwitchSelected);
    setInterval(async () => {
        for (let coinId of coinsFlexSwitchSelected) {
            const data = await fetchDataForCoin(coinId);
            updatedChartForCoin(coinId, data);
        }
    }, 20000); // Fetch data every 20 seconds
}

async function fetchDataForCoin(coinId) {
    // Fetch the data for the given coin
    // This is a placeholder function. You'll need to replace it with actual API call
    // Return the last 20 data points
    const coinsString = coinsFlexSwitchSelected.join(',');
    const apiKey = '716b9103ae80d88d17ccdc65ab359ce503523d7fb8a64509b408d3be0ad2d3a6';
    //const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coinId}&tsym=USD&limit=20&api_key=${apiKey}`);
    const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsString}&tsyms=USD,EUR,ILS&api_key=${apiKey}`;

    //const data = await response.json();
    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    console.log($.data);
    //const prices = $.data.map((item) => item.close);
    const prices = [1, 2, 3, 4, 5];
    console.log(prices);
    return prices;
    //return []; // Return an array of data points
}

function updatedChartForCoin(coinId, data) {
    // // Check if a chart already exists for this coin
    let chartContainer = $(`#chart-${coinId}`);
    if (chartContainer.length === 0) {
        // Create a new chart container if it doesn't exist
        chartContainer = $(`<canvas id="chart-${coinId}" width="400" height="200"></canvas>`);
        $('#charts-container').append(chartContainer);
    }

    const canvas = $(`#chart-${coinId}`)[0] as HTMLCanvasElement;
    console.log(canvas);
    const ctx = canvas.getContext('2d');

    const existingChart = Chart.getChart(ctx);
    if(existingChart) {
        existingChart.destroy();
    }

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Array of labels for each data point, e.g., timestamps
            datasets: [{
                label: `Coin ${coinId}`,
                data: data,
                // You can add more styling options here
            }]
        },
        options: {
            // Chart options
        }
    });

}

function updateChartForCoin(coinId, data) {
    // Check if a chart already exists for this coin
    let chartContainer = $(`#chart-${coinId}`);
    if (chartContainer.length === 0) {
        // Create a new chart container if it doesn't exist
        chartContainer = $(`<canvas id="chart-${coinId}" width="400" height="200"></canvas>`);
        $('#charts-container').append(chartContainer);
    }

    // Create or update the chart
    new Chart(chartContainer[0] as HTMLCanvasElement, {
        type: 'line',
        data: {
            labels: [], // Array of labels for each data point, e.g., timestamps
            datasets: [{
                label: `Coin ${coinId}`,
                data: data,
                // You can add more styling options here
            }]
        },
        options: {
            // Chart options
        }
    });
}
