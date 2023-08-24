import { fetchDriverConstructor, fetchDrivers, fetchLapTime } from '../services/services.js';
import constructorColors from '../helpers/constructorColors.js'
import { formatTimeForDisplay, parseTimeStringToMillis } from '../helpers/formatters.js';

var slowetsLap = 0;
var fastestLap = 9999999999;
var totalLaps = 0;

const createArrayLaps = (laps) => {
    var arrayLaps = [];
    for (let i = 1; i <= laps; i++) {
        arrayLaps.push(i);
    }
    return arrayLaps;
};

const getDriverColor = (constructor) => {
    return constructorColors[constructor];
}

const setSlowestAndFastestLapTime = (lapsTimes) => {
    lapsTimes.forEach(lapTime => {
        if (lapTime > slowetsLap) {
            slowetsLap = lapTime;
        }
        if (lapTime < fastestLap) {
            fastestLap = lapTime;
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



const fillGraficData = async (year, round) => {

    // Dados que vão para o gráfico
    var data = {
        datasets: []
    }

    const drivers = await fetchDrivers(year, round);
    
    for (let i = 0; i < drivers.length; i++) {
        const constructor = await fetchDriverConstructor(year, drivers[i].driverId);
        const lapTimeData = await fetchLapTime(year, round, drivers[i].driverId);
        
        if (totalLaps === 0){
            totalLaps = lapTimeData.total;
            const lapLabel = createArrayLaps(totalLaps);
            const labels = lapLabel.map(item => item);
            data.labels = labels;
        }
        
        const lapTimes = lapTimeData.RaceTable.Races[0].Laps;

        const formatedLapTimes = lapTimes.map(item => parseTimeStringToMillis(item['Timings'][0]['time']));

        setSlowestAndFastestLapTime(formatedLapTimes)

        const dataset = {
            label: drivers[i].code, 
            data: formatedLapTimes, 
            borderColor: getDriverColor(constructor),
            backgroundColor: getDriverColor(constructor),
            borderWidth: 2,
            fill: false
        };
        data.datasets.push(dataset);

        await sleep(1000);
        console.log(drivers[i].code)
    }

    return data;
}

/*const timeString = "1:44.363";
const timeInMillis = parseTimeStringToMillis(timeString);
const formattedTime = formatTimeForDisplay(103608);

console.log(formattedTime);*/


async function createChart() {
    const chartData = await fillGraficData(2023, 1);

    // Gráfico
    const ctx = document.getElementById('meuGrafico').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return formatTimeForDisplay(value); // Usa a função de formatação
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    //stacked: true,
                    //min: parseTimeStringToMillis("1:00.000"), // Define o limite inferior desejado
                    //max: parseTimeStringToMillis("2:30.000"), // Define o limite superior desejado
                    ticks: {
                        callback: function(value, index, values) {
                            return formatTimeForDisplay(value); // Usa a função de formatação dos dados
                        },
                        //stepSize: 100 // Define o intervalo em milissegundos
                    }
                }
            }
        }
    });
}

createChart();
