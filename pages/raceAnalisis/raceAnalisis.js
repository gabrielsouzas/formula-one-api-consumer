import { createChart } from "../../charts/laptimes.js";
import { formatTimeForDisplay, parseTimeStringToMillis } from "../../helpers/formatters.js";
import { fetchLapTime, fetchRaceSchedule } from "../../services/services.js";

const year = document.querySelector('#year');
const race = document.querySelector('#race');
const type = document.querySelector('#type');

const form = document.querySelector('#form');

const tableBody = document.querySelector('#table-body')

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

const fastestDriver = (driver1, driver2, lapTimeDriver1, lapTimeDriver2) => {
    let ld1 = parseTimeStringToMillis(lapTimeDriver1);
    let ld2 = parseTimeStringToMillis(lapTimeDriver2);

    let faster = ld1 < ld2 ? driver1 : ld1 == ld2 ? 'equal time' : driver2;

    return faster;
};

const calculateDifLapTimes = (lapTimeDriver1, lapTimeDriver2) => {
    let ld1 = parseTimeStringToMillis(lapTimeDriver1);
    let ld2 = parseTimeStringToMillis(lapTimeDriver2);

    let dif = ld1 >= ld2 ? ld1 - ld2 : ld2 - ld1;

    return formatTimeForDisplay(dif);
};

const createRow = (driver1, lapNumberDriver1, lapTimeDriver1, lapPositionDriver1,
                    driver2, lapNumberDriver2, lapTimeDriver2, lapPositionDriver2) => {

    const row = document.createElement('tr');

    const cellLapD1 = document.createElement('td');
    const cellLapD2 = document.createElement('td');

    const cellTimeD1 = document.createElement('td');
    const cellTimeD2 = document.createElement('td');

    const cellPositionD1 = document.createElement('td');
    const cellPositionD2 = document.createElement('td');

    const cellDif = document.createElement('td');
    const cellFaster = document.createElement('td');

    cellLapD1.textContent = lapNumberDriver1;
    cellLapD2.textContent = lapNumberDriver2;

    cellTimeD1.textContent = lapTimeDriver1;
    cellTimeD2.textContent = lapTimeDriver2;
    
    cellPositionD1.textContent = lapPositionDriver1;
    cellPositionD2.textContent = lapPositionDriver2;
    
    cellDif.textContent = calculateDifLapTimes(lapTimeDriver1, lapTimeDriver2);
    cellFaster.textContent = fastestDriver(driver1, driver2, lapTimeDriver1, lapTimeDriver2);

    row.appendChild(cellLapD1);
    row.appendChild(cellLapD2);

    row.appendChild(cellTimeD1);
    row.appendChild(cellTimeD2);

    row.appendChild(cellPositionD1);
    row.appendChild(cellPositionD2);

    row.appendChild(cellDif);
    row.appendChild(cellFaster);

    return row;
};

const compareLapsDrivers = async () => {
    try {
        const lapTimesDriver1 = await fetchLapTime(2023, 13, 'hamilton');
        const lapTimesDriver2 = await fetchLapTime(2023, 13, 'alonso');

        //console.log(lapTimesDriver1);

        for (let i = 0; i < lapTimesDriver1.RaceTable.Races[0].Laps.length; i++) {
            
            let lapNumberDriver1 = lapTimesDriver1.RaceTable.Races[0].Laps[i].number;
            let lapNumberDriver2 = lapTimesDriver2.RaceTable.Races[0].Laps[i].number;

            let lapTimeDriver1 = lapTimesDriver1.RaceTable.Races[0].Laps[i].Timings[0].time;
            let lapTimeDriver2 = lapTimesDriver2.RaceTable.Races[0].Laps[i].Timings[0].time;
            
            let lapPositionDriver1 = lapTimesDriver1.RaceTable.Races[0].Laps[i].Timings[0].position;
            let lapPositionDriver2 = lapTimesDriver2.RaceTable.Races[0].Laps[i].Timings[0].position;
            
            const row = createRow('hamilton', lapNumberDriver1, lapTimeDriver1, lapPositionDriver1,
                                    'alonso', lapNumberDriver2, lapTimeDriver2, lapPositionDriver2);

            tableBody.appendChild(row);
            
        }
    } catch (error) {
       console.log(error); 
    }
};

compareLapsDrivers();

form.addEventListener('submit', handleSubmit);

