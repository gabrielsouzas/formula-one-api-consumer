import { createChart } from "../../charts/laptimes.js";
import { fetchRaceSchedule } from "../../services/services.js";

const year = document.querySelector('#year');
const race = document.querySelector('#race');
const type = document.querySelector('#type');

const form = document.querySelector('#form');

var availableRaces = [];
var selectedRound = 1;

const fillYears = () => {
    for (let i = 2023; i >= 2000; i--) {
        const option = document.createElement('option'); 
        option.value = i;
        option.innerText = i;  
        year.appendChild(option);  
    }
};

const fillRaces = async () => {
    availableRaces = await fetchRaceSchedule(year.value);
    if (availableRaces) {
        for (let i = 0; i < availableRaces.length; i++) {
            const option = createOption(availableRaces[i].round, availableRaces[i].raceName);
            race.appendChild(option);
        }
    }
};

const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.innerText = text;
    return option;
};

fillYears();
fillRaces();

year.addEventListener('change', async () => {
    await fillRaces();
});

const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (type.value === 'laptimes') {
        await createChart('lapTimesGrafic', year.value, race.value);
    }
    
};

form.addEventListener('submit', handleSubmit);

