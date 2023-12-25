// import { Chart } from 'chart.js';
import { ExtendedCoin } from './interfaces/coinPrice.js';
import { coinsFlexSwitchSelected } from './state.js';
//import * as $ from 'jquery';
// import  { Chart }    from '../node_modules/chart.js/dist/chart.js';
declare var Chart: any;
const savedCoins: ExtendedCoin[][] = [];
// This function should be called when the "Live Reports" tab is selected
export default function startDataFetchAndUpdate() {
    console.log('startDataFetchAndUpdate');
    console.log(coinsFlexSwitchSelected);
    setInterval(async () => {
        for (let coinId of coinsFlexSwitchSelected) {
            // const data = await fetchDataForCoin(coinId);
            // updatedChartForCoin(coinId, data);
            const coinData: ExtendedCoin = await fetchCoinData(coinId);
            console.log(savedCoins);
            if(!savedCoins[coinId]) {
                savedCoins[coinId] = [];
            }
            if(savedCoins[coinId].length < 20) {
                savedCoins[coinId].push([coinData]);
            } else {
                savedCoins[coinId].shift();
                savedCoins[coinId].push([coinData]);
            }
            console.log(savedCoins);
            
        }
        updatedChartForCoin(savedCoins);
    }, 20000); // Fetch data every 20 seconds
}

async function fetchCoinData(coinId: string): Promise<ExtendedCoin> {
    // Replace this with your actual data fetching logic
    //const response = await fetch('your-api-url/' + coinId);
    //const data = await response.json();

    const coinsString = coinsFlexSwitchSelected.join(',');
    const apiKey = '716b9103ae80d88d17ccdc65ab359ce503523d7fb8a64509b408d3be0ad2d3a6';
    //const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coinId}&tsym=USD&limit=20&api_key=${apiKey}`);
    const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinId}&tsyms=USD,EUR,ILS&api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    const coinPrices = data[coinId.toUpperCase()] // This will be like: { USD: 102.44, EUR: 93.36, ILS: 370.2 }
    console.log("coinPrices:", coinPrices);
    // Creating the ExtendedCoin object
    const extendedCoin: ExtendedCoin = {
        id: coinId,
        symbol: coinId, // Assuming symbol is same as coinId, update if different
        name: coinId, // Assuming name is same as coinId, update if different
        prices: {
            USD: coinPrices.USD,
            EUR: coinPrices.EUR,
            ILS: coinPrices.ILS
        }
    };
    console.log(extendedCoin);
    return extendedCoin;
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

function updatedChartForCoin(savedCoins: ExtendedCoin[][]) {
    // // Check if a chart already exists for this coin
    let chartContainer = $(`#chart-${coinId}`);
    if (chartContainer.length === 0) {
        // Create a new chart container if it doesn't exist
        chartContainer = $(`<canvas id="chart-${coinId}" style="width:400px, height:200px"></canvas>`);
        $('#charts-container').append(chartContainer);
    }

    const canvas = $(`#chart-${coinId}`)[0] as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const existingChart = Chart.getChart(ctx);
    if(existingChart) {
        existingChart.destroy();
    }

    if (ctx) {
        console.log("ctx:", ctx);
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['USD', 'EUR', 'ILS'], // Labels for the x-axis
                datasets: [{
                    label: 'USD', // Coin name
                    data: [coinData.prices.USD], // Prices
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'EUR', // Coin name
                    data: [coinData.prices.EUR], // Prices
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'ILS', // Coin name
                    data: [coinData.prices.ILS], // Prices
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
             options: {
            }
            
        });
        console.log("chart:", chart);
    } else {
        console.error('ctx is null');
    }

    // const chart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: [], // Array of labels for each data point, e.g., timestamps
    //         datasets: [{
    //             label: `Coin ${coinId}`,
    //             data: data,
    //             // You can add more styling options here
    //         }]
    //     },
    //     options: {
    //         // Chart options
    //     }
    // });

}

