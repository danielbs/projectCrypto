import Coin from "../interfaces/coin.js";

export default function coinHtml(coin: Coin): string {
    return (`
        <div class="selectedCoin">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-8">
                            <h5 class="card-title" style="padding-right: 40px;">${coin.name}</h5>
                        </div>
                        <div class="col-4 d-flex justify-content-end form-check form-switch custom-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheck-${coin.id}" checked>
                        </div>
                    </div>
                    <p class="card-text">${coin.symbol}</p>
                    <div class="collapse" id="collapse-${coin.id}">
                        <div class="card card-body" id="data-container-${coin.id}">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

