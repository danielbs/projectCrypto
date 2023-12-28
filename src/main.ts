import CoinData from './interfaces/coin-data.js';
import Coin from './interfaces/coin.js';
import reduceCoins from './reducers/coins.js';
import coinHtml from './reducers/modalCoins.js';
import Cache from './Cache.js';
import startDataFetchAndUpdate from './liveReports.js';
import { coinsFlexSwitchSelected } from './state.js';
import * as $ from 'jquery';

// Use coinsFlexSwitchSelected as needed

const cache = Cache.getInstance();
var coins: Coin[] = [];
// create array for coins flex switch selected
//const coinsFlexSwitchSelected: string[] = [];

async function getCoins(): Promise<Coin[]> {
    // const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    // const response = await fetch('coins.json');
    // const coins: Coin[] = await response.json();
    // const cacheResponse = await cache.getData('https://api.coingecko.com/api/v3/coins/list');
    const cacheResponse = await cache.getData('coins.json');
    const coins: Coin[] = (cacheResponse) as Coin[]
    console.log(coins)

    return coins;
}

async function getCoinData(coinId: string): Promise<CoinData> {
    const cacheResponse = await cache.getData(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const coinData: CoinData = (cacheResponse) as CoinData
    return coinData;
}

async function coinsSearch(e: MouseEvent) {
    if (e.target instanceof HTMLElement) {
        let inputSearch = document.getElementById("input-search") as HTMLInputElement;
        let searchText: string = inputSearch.value;
        let searchedConins: Coin[] = coins.filter(item => item.symbol.includes(searchText))
        let shortList = searchedConins.slice(0, 100);

        let html = reduceCoins(shortList);
        document.getElementById('coins-container').innerHTML = html;
    }
}

async function coinsContainerClicked(e: MouseEvent) {
    if (e.target instanceof HTMLElement) {
        const element = e.target as HTMLElement;
        if (element.id.startsWith('more-info-')) {
            const coinId = element.id.substring('more-info-'.length);
            const coinData = await getCoinData(coinId);
            console.log(coinData);
            document.getElementById(`data-container-${coinId}`).innerHTML = `
                <img src="${coinData.image.thumb}"/> <br>
                usd: ${coinData.market_data.current_price.usd} <br>
                eur: ${coinData.market_data.current_price.eur} <br>
                ils: ${coinData.market_data.current_price.ils}
            `;
        }
    }
}

async function coinsFlexSwitchClicked(e: MouseEvent) {
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
        const checkbox = e.target as HTMLInputElement;
        if (checkbox.id.startsWith('flexSwitchCheck-')) {
            const coinId = checkbox.id.substring('flexSwitchCheck-'.length);
            // check if checkbox is checked and if there are less than 5 coins selected
            if (coinsFlexSwitchSelected.length < 5 || checkbox.checked === false) {
                if (checkbox.checked) {
                    // Checkbox is checked, add to array
                    if (!coinsFlexSwitchSelected.includes(coinId)) {
                        coinsFlexSwitchSelected.push(coinId);
                    }
                } else {
                    // Checkbox is not checked, remove from array
                    const index = coinsFlexSwitchSelected.indexOf(coinId);
                    if (index > -1) {
                        coinsFlexSwitchSelected.splice(index, 1);
                    }
                }
                console.log(coinsFlexSwitchSelected);
            } else {
                updateSelectedCoinsModal();
                checkbox.checked = false;
            }
        }
    }
}

function openModal() {
    (document.getElementById('checkSelectedCoinsModal') as HTMLElement).style.display = 'block';
}

// Function to close the modal
function closeModal() {
    (document.getElementById('checkSelectedCoinsModal') as HTMLElement).style.display = 'none';
}

function saveSelectedCoins() {
    let parentElement = document.getElementById('checkSelectedCoinsModal') as HTMLElement | null;
    if(parentElement) {
        let coinElements = parentElement.querySelectorAll('.selectedCoin') as NodeListOf<HTMLElement>;
        coinElements.forEach(coinElement => {
            let coinIdElement = coinElement.querySelector('input') as HTMLInputElement;
            let coinId = coinIdElement.id.substring('flexSwitchCheck-'.length);
            if(!coinIdElement.checked){
                let index = coinsFlexSwitchSelected.indexOf(coinId);
                if (index > -1) {
                    coinsFlexSwitchSelected.splice(index, 1);
                }
                let mainCoinElement = document.getElementById('coins-container').querySelector(`#flexSwitchCheck-${coinId}`) as HTMLInputElement;
                mainCoinElement.checked = false;
            }
        });
    }
    (document.getElementById('checkSelectedCoinsModal') as HTMLElement).style.display = 'none';
}


function updateSelectedCoinsModal() {
    let selectedCoinsList = document.getElementById('selectedCoinsList');
    if (selectedCoinsList) {
        let html: string = ''

        for (const coinId of coinsFlexSwitchSelected) {
            let coin: Coin | undefined = coins.find((item: Coin) => item.id === coinId);
            if (coin) {
                html += coinHtml(coin);
            }
        }
        selectedCoinsList.innerHTML = html;
        openModal();
    }
}


(async () => {
    // init
    document.getElementById('coins-container').addEventListener('click', coinsContainerClicked);
    document.getElementById('coins-container').addEventListener('click', coinsFlexSwitchClicked);
    document.getElementById('btn-search').addEventListener('click', coinsSearch);
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-selection').addEventListener('click', closeModal);
    document.getElementById('save-selection').addEventListener('click', saveSelectedCoins);

    // get data
    coins = await getCoins();

    // prepare data

    // cut list to 100 coins
    const shortList = coins.slice(0, 100);

    // reduce to create the HTML string of the cards
    const html = reduceCoins(shortList);

    // display
    document.getElementById('coins-container').innerHTML = html;

    document.getElementById('live-reports-tab').addEventListener('click', () => {
        // Call the function or method when the tab is clicked
        startDataFetchAndUpdate();
    });
})();
