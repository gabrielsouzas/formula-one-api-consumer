import { fetchConstructorsStandings, fetchDriversStandings, fetchRaceResult, fetchRaceSchedule } from "../services/services.js";

const tableTitle = document.querySelector('.table-title');
const extraInfo = document.querySelector('.extra-info');
const tableBody = document.getElementById('table-body');
const tableHead = document.getElementById('table-head');
const menuButtons = document.querySelectorAll('.menu button');

var clickedButtonId = 'mn-rc-schd';
const currentYear = new Date().getFullYear();

const fillTableHead = (theads) => {
    tableHead.innerHTML = '';

    const tr = document.createElement('tr');

    theads.forEach(thead => {
        const th = document.createElement('th');
        th.innerHTML = thead;

        tr.appendChild(th);
    });

    tableHead.appendChild(tr);
};

const fillTableRacesSchedule = async (year = 'current') => {
    try {
        const races = await fetchRaceSchedule(year);

        tableTitle.innerHTML = 'Races Schedule';
        extraInfo.style.display = 'none';

        const theads = [ 'Season', 'Round', 'Race Name', 'Date', 'Time', 'Sprint', 'Circuit',];
        fillTableHead(theads);

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

const calculateMaxPointsInDispute = async (type='') => {
    const racesResult = await fetchRaceResult();
    const currentRound = racesResult.RaceTable.round;
    
    const racesSchedule = await fetchRaceSchedule();
    
    var maxPoints = 0;
    var pointsPerRace = 26;
    var pointsPerSprint = 26;

    if (type === 'constructors') {
        pointsPerRace = 44;
        pointsPerSprint = 15;
    }

    racesSchedule.forEach(race => {
        if (Number(race.round) > Number(currentRound)) {
            maxPoints += pointsPerRace;
            if ('Sprint' in race) {
                maxPoints += pointsPerSprint;
            }
        }
    });

    return maxPoints;
};

const fillTableConstructorsStandings = async (year = 'current') => {
    try {
        const constructors = await fetchConstructorsStandings(year);

        tableTitle.innerHTML = 'Constructor Standings';
        if (year === 'current' || year === currentYear.toString()) {
            const maxPointsIn = await calculateMaxPointsInDispute('constructors');
            extraInfo.innerHTML = `Max Points in Dispute: ${maxPointsIn}`;
            extraInfo.style.display = 'block';
        }

        const theads = [ 'Position', 'Name', 'Points', 'Dif. Próx. Team', 'Wins', 'Nacionality',];
        fillTableHead(theads);

        tableBody.innerHTML = '';

        for (let i = 0; i < constructors.length; i++) {
            const row = document.createElement('tr');

            const cellPosition = document.createElement('td');
            const cellName = document.createElement('td');
            const cellPoints = document.createElement('td');
            const cellDifBehind = document.createElement('td');
            const cellWins = document.createElement('td');
            const cellNacionality = document.createElement('td');

            const nextIndex = i+1 < constructors.length ? i+1 : i;

            cellPosition.textContent = constructors[i].position;
            cellName.textContent = constructors[i].Constructor.name;
            cellPoints.textContent = constructors[i].points;
            cellDifBehind.textContent = constructors[i].points - constructors[nextIndex].points;
            cellWins.textContent = constructors[i].wins;
            cellNacionality.textContent = constructors[i].Constructor.nationality;

            row.appendChild(cellPosition);
            row.appendChild(cellName);
            row.appendChild(cellPoints);
            row.appendChild(cellDifBehind);
            row.appendChild(cellWins);
            row.appendChild(cellNacionality);

            tableBody.appendChild(row);
        }
    } catch (error) {
        console.log(error);
    }
}

const calculateDriverAge = (dateOfBirth) => {
    const data1 = new Date(dateOfBirth);
    const data2 = new Date();

    const diferencaEmMilissegundos = data2 - data1;

    const milissegundosEmUmAno = 1000 * 60 * 60 * 24 * 365.25; // Considerando anos bissextos
    const diferencaEmAnos = diferencaEmMilissegundos / milissegundosEmUmAno;

    return Math.trunc(diferencaEmAnos); // Resultado da diferença em anos
};

const fillTableDriversStandings = async (year = 'current') => {
    try {
        const drivers = await fetchDriversStandings(year);

        tableTitle.innerHTML = 'Drivers Standings';
        if (year === 'current' || year === currentYear.toString()) {
            const maxPointsIn = await calculateMaxPointsInDispute();
            extraInfo.innerHTML = `Max Points in Dispute: ${maxPointsIn}`;
            extraInfo.style.display = 'block';
        }

        const theads = [ 'Position', 'Name', 'Points', 'Dif. Próx. Driver', 'Number', 'Nacionality', 'Age', 'Team',];
        fillTableHead(theads);

        tableBody.innerHTML = '';

        for (let i = 0; i < drivers.length; i++) {
            const row = document.createElement('tr');

            const cellPosition = document.createElement('td');
            const cellName = document.createElement('td');
            const cellPoints = document.createElement('td');
            const cellDifBehind = document.createElement('td');
            const cellNumber = document.createElement('td');
            const cellNacionality = document.createElement('td');
            const cellAge = document.createElement('td');
            const cellTeam = document.createElement('td');

            const nextIndex = i+1 < drivers.length ? i+1 : i;

            cellPosition.textContent = drivers[i].position;
            cellName.textContent = `${drivers[i].Driver.givenName} ${drivers[i].Driver.familyName}`;
            cellPoints.textContent = drivers[i].points;
            cellDifBehind.textContent = drivers[i].points - drivers[nextIndex].points;
            cellNumber.textContent = drivers[i].Driver.permanentNumber;
            cellNacionality.textContent = drivers[i].Driver.nationality;
            cellAge.textContent = calculateDriverAge(drivers[i].Driver.dateOfBirth);
            cellTeam.textContent = drivers[i].Constructors[0].name;

            row.appendChild(cellPosition);
            row.appendChild(cellName);
            row.appendChild(cellPoints);
            row.appendChild(cellDifBehind);
            row.appendChild(cellNumber);
            row.appendChild(cellNacionality);
            row.appendChild(cellAge);
            row.appendChild(cellTeam);

            tableBody.appendChild(row);
        }
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

const createElement = (tag, text='', id='', type='', value='') => {
    const element = document.createElement(tag);
    
    text && (element.innerText = text);
    id && (element.id = id);
    type && (element.type = type);
    value && (element.value = value);

    return element;
};

/*const createDivModal = (labelText, fieldTag, fieldText='', fieldId='', fieldType='') => {
    const label = createElement('label', labelText);
    const field = createElement(fieldTag, fieldText, fieldId, fieldType);

    const div = document.createElement('div');
    div.appendChild(label)
    div.appendChild(field);

    return div;
};*/

const loadMenuClick = (idButton) => {
    if (idButton === 'mn-rc-anls') {
        window.location.href = '/pages/raceAnalisis/raceAnalisis.html';
    } else if (idButton === 'mn-qly-anls') {
        window.location.href = '/pages/raceAnalisis/raceAnalisis.html';
    } else {
        modalForm.innerHTML = '';
        
        const label = createElement('label', 'Year');
        const input = createElement('input', '', 'inp-md-year', 'number', currentYear);

        const div = document.createElement('div');
        div.appendChild(label)
        div.appendChild(input);
        
        modalForm.appendChild(div);

        modal.style.display = 'block';
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
        fillTableDriversStandings(inputModalYear.value);
    } else if (clickedButtonId === 'mn-cntrtr-stdngs') {
        fillTableConstructorsStandings(inputModalYear.value);
    } else if (clickedButtonId === 'mn-rc-anls') {
        
    } else if (clickedButtonId === 'mn-qly-anls') {
        
    }
});

btnCancel.addEventListener('click', () => {
    modal.style.display = 'none';
});
