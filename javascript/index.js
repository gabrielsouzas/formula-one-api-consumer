import { fetchDriversStandings, fetchRaceSchedule } from "../services/services.js";

const tableBody = document.getElementById('table-body');
const menuButtons = document.querySelectorAll('.menu button');

var clickedButtonId = 'mn-rc-schd';

const fillTableRacesSchedule = async (year = 'current') => {
    try {
        const races = await fetchRaceSchedule(year);

        tableBody.innerHTML = '';

        races.forEach(races => {
            const row = document.createElement('tr');

            const cellSeason = document.createElement('td');
            const cellRound = document.createElement('td');
            const cellRaceName = document.createElement('td');
            const cellDate = document.createElement('td');
            const cellTime = document.createElement('td');
            const cellSprint = document.createElement('td');
            const cellCircuit = document.createElement('td');

            cellSeason.textContent = races.season;
            cellRound.textContent = races.round;
            cellRaceName.textContent = races.raceName;
            cellDate.textContent = races.date;
            cellTime.textContent = races.time;
            cellSprint.textContent = 'Sprint' in races ? races.Sprint.date : '';
            cellCircuit.textContent = races.Circuit.circuitName;

            row.appendChild(cellSeason);
            row.appendChild(cellRound);
            row.appendChild(cellRaceName);
            row.appendChild(cellDate);
            row.appendChild(cellTime);
            row.appendChild(cellSprint);
            row.appendChild(cellCircuit);

            tableBody.appendChild(row);
        });
    
    } catch (error) {
        console.log(error);
    }
}

const fillTableDriversStandings = async () => {
    try {
        const races = await fetchDriversStandings();

        tableBody.innerHTML = '';

        races.forEach(races => {
            const row = document.createElement('tr');

            const cellSeason = document.createElement('td');
            const cellRound = document.createElement('td');
            const cellRaceName = document.createElement('td');
            const cellDate = document.createElement('td');
            const cellTime = document.createElement('td');
            const cellSprint = document.createElement('td');
            const cellCircuit = document.createElement('td');

            cellSeason.textContent = races.season;
            cellRound.textContent = races.round;
            cellRaceName.textContent = races.raceName;
            cellDate.textContent = races.date;
            cellTime.textContent = races.time;
            cellSprint.textContent = 'Sprint' in races ? races.Sprint.date : '';
            cellCircuit.textContent = races.Circuit.circuitName;

            row.appendChild(cellSeason);
            row.appendChild(cellRound);
            row.appendChild(cellRaceName);
            row.appendChild(cellDate);
            row.appendChild(cellTime);
            row.appendChild(cellSprint);
            row.appendChild(cellCircuit);

            tableBody.appendChild(row);
        });
    
    } catch (error) {
        console.log(error);
    }
}

fillTableRacesSchedule();

const modal = document.querySelector('.modal');
const modalForm = document.querySelector('.modal-form')
const spanClose = document.querySelector('.close');
const btnConfirm = document.querySelector('#btn-confirm');
const btnCancel = document.querySelector('#btn-cancel');

const loadMenuClick = (idButton) => {
    if (idButton === 'mn-rc-schd') {
        modalForm.innerHTML = '';
        
        const label = document.createElement('label');
        label.innerText = 'Year:';
        const input = document.createElement('input');
        input.id = 'inp-md-year'
        input.type = 'number';

        const div = document.createElement('div');
        div.appendChild(label)
        div.appendChild(input);
        
        modalForm.appendChild(div);

        modal.style.display = 'block';
    } else if (idButton === 'mn-drv-stdngs') {
        
    } else if (idButton === 'mn-cntrtr-stdngs') {
        
    } else if (idButton === 'mn-rc-anls') {
        
    } else if (idButton === 'mn-qly-anls') {
        
    }
}

menuButtons.forEach(menuButton => {
    menuButton.addEventListener('click', () => {
        clickedButtonId = menuButton.id;
        loadMenuClick(menuButton.id);
    });
});

/* Modal */



spanClose.addEventListener('click', () => {
    modal.style.display = 'none';
});

btnConfirm.addEventListener('click', () => {
    modal.style.display = 'none';

    const inputModalYear = document.querySelector('#inp-md-year');

    if (clickedButtonId === 'mn-rc-schd') {
        fillTableRacesSchedule(inputModalYear.value);
    } else if (clickedButtonId === 'mn-drv-stdngs') {
        
    } else if (clickedButtonId === 'mn-cntrtr-stdngs') {
        
    } else if (clickedButtonId === 'mn-rc-anls') {
        
    } else if (clickedButtonId === 'mn-qly-anls') {
        
    }
});

btnCancel.addEventListener('click', () => {
    modal.style.display = 'none';
});
