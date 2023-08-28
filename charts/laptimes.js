import { fetchDriverConstructor, fetchDrivers, fetchLapTime } from '../services/services.js';
import constructorColors from '../helpers/constructorColors.js'
import { formatTimeForDisplay, parseTimeStringToMillis } from '../helpers/formatters.js';
import { validateLapTime } from '../helpers/validation.js';

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

const fillGraficData = async (year, round, plusAverage) => {

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

        
        
        const lapTimes = lapTimeData.RaceTable.Races.length > 0 ? lapTimeData.RaceTable.Races[0].Laps : '';

        const formatedLapTimes = lapTimes.length > 0 ? lapTimes.map(item => parseTimeStringToMillis(item['Timings'][0]['time'])) : '';

        //setSlowestAndFastestLapTime(formatedLapTimes)

        // Verifica se possui valores muito acima da média que podem comprometer os dados
        const validatedLapTimes = validateLapTime(formatedLapTimes, plusAverage);
        

        const dataset = {
            label: drivers[i].code, 
            data: validatedLapTimes, //formatedLapTimes, 
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

export async function createChart(idGrafic, year, round, plusAverage = 2) {

    const gridColor = '#42474B';
    const labelsColor = '#FFF';

    const chartData = await fillGraficData(year, round, plusAverage);

    /*const filter = ['ALO', 'VER', 'HAM', 'LEC'];

    const filteredDatasets = chartData.datasets.filter(dataset => filter.includes(dataset.label));
    
    const filteredChartData = {
        ...chartData,
        datasets: filteredDatasets
    };*/
    
    // Gráfico
    const ctx = document.getElementById(idGrafic).getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData, //filteredChartData,
        options: {
            
            plugins: {
                legend: {
                    labels: {
                        color: labelsColor // Defina a cor desejada para as legendas
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return formatTimeForDisplay(value); // Usa a função de formatação
                        }
                    }
                },
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
                        color: labelsColor
                        //stepSize: 100 // Define o intervalo em milissegundos
                    },
                    grid: {
                        color: gridColor // Defina a cor desejada para as linhas horizontais
                    }
                },
                x: {
                    ticks: {
                        color: labelsColor
                    },
                    grid: {
                        color: gridColor // Defina a cor desejada para as linhas verticais
                    },
                },
            }
        }
    });
}

//createChart();
