import { fetchDriverConstructor, fetchDrivers, fetchLapTime } from '../services/services.js';

const createArrayLaps = (laps) => {
    var arrayLaps = [];
    for (let i = 1; i <= laps; i++) {
        arrayLaps.push(i);
    }
    return arrayLaps;
};

const fillLapTimeDriver = async (driver) => {
    try {
        const laptimes = await fetchLapTime(2023, 5, driver);
    if (laptimes) {
        return laptimes;
    } else {
        return {error: 'Erro na requisição!'}
    }
    } catch (error) {
        console.log(error);
        return {error};
    }

    //const totalLaps = laptimes.total;
    //const lapLabel = createArrayLaps(totalLaps);



    /*data.datasets.push({
        label: 'Gabriel',
            data: [1.50, 1.60, 1.35, 1.30, 1.20],
            borderColor: 'rgba(100, 150, 192, 1)',
            borderWidth: 2,
            fill: false
    })*/
};




async function fillGraficData() {
    const drivers = await fetchDriverConstructor(2023, 'hamilton');
    
    const apiData = await fillLapTimeDriver('hamilton');
    
    const totalLaps = apiData.total;
    const lapLabel = createArrayLaps(totalLaps);
    const labels = lapLabel.map(item => item);
    
    const lapTimes = apiData['RaceTable']['Races']['0']['Laps'];

    const laps = lapTimes.map(item => parseTimeStringToMillis(item['Timings'][0]['time']));

    console.log(laps);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Hamilton',
                data: laps,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            },
        ]
    };

    const ctx = document.getElementById('meuGrafico').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    stacked: true,
                    min: parseTimeStringToMillis("1:20.000"), // Define o limite inferior desejado
                    max: parseTimeStringToMillis("1:50.000"), // Define o limite superior desejado
                    ticks: {
                        callback: function(value, index, values) {
                            return formatTimeForDisplay(value); // Usa a função de formatação dos dados
                        },
                        stepSize: 100 // Define o intervalo em milissegundos
                    }
                }
            }
        }
    });
}

fillGraficData();

function parseTimeStringToMillis(timeString) {
    const parts = timeString.split(':');

    if (parts.length !== 2) {
        throw new Error('Formato de tempo inválido');
    }

    const minutes = parseInt(parts[0]);
    const secondsAndMillis = parts[1].split('.');
    const seconds = parseInt(secondsAndMillis[0]);
    const milliseconds = parseInt(secondsAndMillis[1]);

    const totalTimeInMillis = (minutes * 60 + seconds) * 1000 + milliseconds;

    return totalTimeInMillis;
}

function formatTimeForDisplay(timeInMillis) {
    const totalSeconds = timeInMillis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = timeInMillis % 1000;

    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

/*const timeString = "1:44.363";
const timeInMillis = parseTimeStringToMillis(timeString);
const formattedTime = formatTimeForDisplay(timeInMillis);

console.log(formattedTime);*/

