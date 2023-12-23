var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import reduceCoins from './reducers/coins.js';
import Cache from './Cache.js';
import startDataFetchAndUpdate from './liveReports.js';
import { coinsFlexSwitchSelected } from './state.js';
// Use coinsFlexSwitchSelected as needed
const cache = Cache.getInstance();
// create array for coins flex switch selected
//const coinsFlexSwitchSelected: string[] = [];
function getCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        // const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
        // const response = await fetch('coins.json');
        // const coins: Coin[] = await response.json();
        // const cacheResponse = await cache.getData('https://api.coingecko.com/api/v3/coins/list');
        const cacheResponse = yield cache.getData('coins.json');
        const coins = (cacheResponse);
        console.log(coins);
        return coins;
    });
}
function getCoinData(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheResponse = yield cache.getData(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const coinData = (cacheResponse);
        return coinData;
    });
}
function coinsContainerClicked(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            if (element.id.startsWith('more-info-')) {
                const coinId = element.id.substring('more-info-'.length);
                const coinData = yield getCoinData(coinId);
                console.log(coinData);
                document.getElementById(`data-container-${coinId}`).innerHTML = `
                <img src="${coinData.image.thumb}"/> <br>
                usd: ${coinData.market_data.current_price.usd} <br>
                eur: ${coinData.market_data.current_price.eur} <br>
                ils: ${coinData.market_data.current_price.ils}
            `;
            }
        }
    });
}
function coinsFlexSwitchClicked(e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            const checkbox = e.target;
            if (checkbox.id.startsWith('flexSwitchCheck-')) {
                const coinId = checkbox.id.substring('flexSwitchCheck-'.length);
                // check if checkbox is checked and if there are less than 5 coins selected
                if (coinsFlexSwitchSelected.length < 5 || checkbox.checked === false) {
                    if (checkbox.checked) {
                        // Checkbox is checked, add to array
                        if (!coinsFlexSwitchSelected.includes(coinId)) {
                            coinsFlexSwitchSelected.push(coinId);
                        }
                    }
                    else {
                        // Checkbox is not checked, remove from array
                        const index = coinsFlexSwitchSelected.indexOf(coinId);
                        if (index > -1) {
                            coinsFlexSwitchSelected.splice(index, 1);
                        }
                    }
                    console.log(coinsFlexSwitchSelected);
                }
                else {
                    alert('You can select up to 5 coins');
                    checkbox.checked = false;
                }
            }
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    // init
    document.getElementById('coins-container').addEventListener('click', coinsContainerClicked);
    document.getElementById('coins-container').addEventListener('click', coinsFlexSwitchClicked);
    // get data
    const coins = yield getCoins();
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
}))();
