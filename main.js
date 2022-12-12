/** @format */

const data = getData();

let intialUnits = data ? data.intialUnits : [];

let units = data && data.length > 0 ? data.units : [...intialUnits];

const intialUnits_dom = document.querySelector("#intial-units");

const units_dom = (document.querySelector("#units").innerText = units);
const stake = document.querySelector("#stake");
const outcome = document.querySelector("#outcome");
const strategy2Btn = document.querySelector("#strategy2");
const strategy3Btn = document.querySelector("#strategy3");
const games_dom = document.querySelector("#games");
const tbody = document.querySelector("#tbody");
const savebtn = document.querySelector("#save-btn");
const clearBtn = document.querySelector("#remove-data");
const nextstake_dom = document.querySelector("#nextstake");
const initialUnitsInput = document.querySelector("#intial-units-input");
const processInfo = document.querySelector("#process-info");
const odd2Display = document.querySelector("#odd2-display");
const odd2Input = document.querySelector("#odd2");
const targetProfit_dom = document.querySelector("#target-profit");

intialUnits_dom.innerText = intialUnits;

let games = data ? data.games : [];
let profit = data ? data.profit : 0;
const odd = data ? data.odd : 2;
let odd2 = data ? data.odd2 : 1;
const wins = data ? data.wins : [];
const loses = data ? data.loses : [];

odd2Display.innerText = odd2;

strategy2Btn.addEventListener("click", () => {
  if (isWonOrLost(outcome.value) && !isNaN(1 * stake.value)) {
    console.log("good input");
  } else {
    alert("bad input");
    return;
  }

  const gameOutcome = outcome.value;

  const betslip = {
    stake: stake.value,
    outcome: gameOutcome,
  };
  if (gameOutcome == "won") {
    remove2(units);
    wins.push(betslip);
  } else if (gameOutcome == "lost") {
    const toAdd = add2(units);
    units.push(toAdd);
    loses.push(betslip);
  } else {
    stake.value = "?";
  }
  profit = calcProfit(wins, loses, odd);

  const game = {
    stake: add2(units),
    outcome: gameOutcome,
    units: [...units],
    profit,
  };

  games.push(game);
  renderGames();
  saveData();
});

savebtn.addEventListener("click", () => {
  saveData();
});

clearBtn.addEventListener("click", () => {
  removeData();
});
//helpers
function add2(arr) {
  const units = [...arr];
  if (units.length > 1) {
    const numb1 = units[0] ? units[0] : 0;
    const numb2 = units[units.length - 1] ? units[units.length - 1] : 0;
    return numb1 + numb2;
  } else if (units.length == 1) {
    const numb1 = units[0];
    const numb2 = 0;
    return numb1 + numb2;
  } else {
    return 0;
  }
}

function remove2(units) {
  units.shift();
  units.pop();
  return units;
}
function add3(units) {
  if (units.length >= 3) {
    const numb1 = units.shift();
    const numb2 = units.shift();
    const numb3 = units.pop();

    return numb1 + numb2 + numb3;
  } else if (units.length == 2) {
    const numb1 = units[0];
    const numb2 = units[1];
    return numb1 + numb2;
  } else if (units.length == 1) {
    const numb1 = units[0];
    return numb1;
  } else {
    return 0;
  }
}
function remove3(units) {
  units.shift();
  units.pop();
  units.shift();

  return units;
}
function getTotalStakes(arr) {
  if (arr.length < 1) {
    return 0;
  }
  let totalStakes = 0;
  arr.forEach((betslip) => {
    totalStakes += 1 * betslip.stake;
  });

  return totalStakes;
}

function renderGames() {
  tbody.innerHTML = ``;
  const content = games.map((game, index) => {
    return `<tr>
      <td>${index + 1}</td>
      <td>Ghc ${game.stake}</td>
      <td>${game.outcome}</td>
      <td>${game.units}</td>
      <td>${game.profit}</td>
    </tr>`;
  });

  tbody.innerHTML = content;

  const nextstake = add2([...units]);
  nextstake_dom.innerText = ` Next Stake ${nextstake}`;

  if (nextstake == 0) {
    nextstake_dom.innerText = `Congrats...!!!`;
  }
  getTargetProfit();
}
renderGames();

function calcProfit(wins, loses, odd) {
  const totalWinStakes = getTotalStakes(wins) * 1;
  const totalLostStakes = getTotalStakes(loses) * 1;

  console.log(totalWinStakes, totalLostStakes);
  const profit = odd * totalWinStakes - (totalWinStakes + totalLostStakes);

  return profit;
}

function getNextStake(units, strategy) {
  let numb1 = 0;
  let numb2 = 0;
  let numb3 = 0;
  let nextstake = 0;

  if (strategy == 1) {
    numb1 = units[0];
    numb2 = units[units.length - 1];
    nextstake = numb1 + numb2;
    return nextstake;
  } else {
  }
}

function setOdd2() {
  if (games.length < 1) {
    if (odd2Input.value < 1) {
      alert("odds can't be less than 1");
      return;
    }
    {
      odd2 = odd2Input.value - 1;
    }
    odd2Display.innerText = `odd2 is set to ${odd2Input.value}`;
  } else {
    alert("sorry, you have an on going bet");
  }
}
function resetOdd() {
  if (games.length < 1) {
    odd2 = 1;
    odd2Display.innerText = `odd2 is reset to default`;
    saveData();
  } else {
    alert("sorry, you have an on going bet");
  }
}

function getData() {
  let mdata = localStorage.getItem("data");
  mdata = JSON.parse(mdata);
  if (mdata) {
    return mdata;
  } else {
    return undefined;
  }
}

function getTargetProfit() {
  targetProfit_dom.innerText = getArraySum(intialUnits) * odd2;
}

function getArraySum(arr) {
  arr = [...arr];
  let sum = 0;
  arr.forEach((el) => {
    sum += el;
  });
  return sum;
}

function saveData() {
  let data = {
    units,
    intialUnits,
    games,
    profit,
    odd,
    odd2,
    wins,
    loses,
  };

  data = JSON.stringify(data);

  localStorage.setItem("data", data);
  console.log("data saved");
}

function removeData() {
  localStorage.removeItem("data");
  console.log("data removed");
  location.reload();
}

function isWonOrLost(value) {
  if (value == "won") {
    return true;
  } else if (value == "lost") {
    return true;
  } else {
    return false;
  }
}

function setInitialUnitsInput() {
  intialUnits = initialUnitsInput.value.split(",");
  intialUnits = convertToArrayOfNumbers(intialUnits);

  console.log(games.length <= 0);
  if (Array.isArray(intialUnits) && games.length < 1) {
    units = intialUnits;
    intialUnits_dom.innerText = intialUnits;
    saveData();
    location.reload();
  } else {
    alert("clear data to set new units");
  }
}

function convertToArrayOfNumbers(arr) {
  let stringNumbers = [...arr];

  const numbersArray = stringNumbers.map((stringNumber) => {
    return stringNumber * 1;
  });

  return numbersArray;
}

async function saveOnline() {
  processInfo.innerText = "saving... data online";
  const url = "https://online-storage.up.railway.app/api/v1/data/";
  const config = {
    url,
    data: { id: "betdata", name: "data", value: localStorage.getItem("data") },
    method: "POST",
  };

  try {
    const response = await axios(config);
    const data = response.data;

    processInfo.innerText = "synced to local";
  } catch (error) {
    if (error.request) {
      processInfo.innerText = "no internet connection";
    }

    processInfo.innerText = error.message;
  }
}

// saveOnline();

async function syncToLocal() {
  processInfo.innerText = "Sync... to local";
  const url = "https://online-storage.up.railway.app/api/v1/data/betdata";

  try {
    const response = await axios.get(url);
    let data = response.data;

    data = data.data.value;
    localStorage.setItem("data", data);

    processInfo.innerText = "Synced to local";
  } catch (error) {
    if (error.request) {
      processInfo.innerText = "no internet connection";
      return;
    }

    processInfo.innerText = error.message;
  }
}

// syncToLocal();
