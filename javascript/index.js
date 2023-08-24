import { fetchRaceSchedule } from "../services/services.js";

const tableBody = document.getElementById('table-body');

const fillTable = async () => {
    try {
        const races = await fetchRaceSchedule();

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

fillTable();