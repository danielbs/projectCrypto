import Coin from "./coin.js";

export interface CoinPrice {
    USD: number;
    EUR: number;
    ILS: number;
}

export interface ExtendedCoin extends Coin {
    prices: CoinPrice;
}
