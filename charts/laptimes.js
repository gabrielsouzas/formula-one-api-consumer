// Dados em formato JSON
const data = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
        {
            label: 'Alonso',
            data: [1.37, 1.39, 1.30, 1.35, 1.40],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        },
        {
            label: 'Hamilton',
            data: [1.45, 1.32, 1.33, 1.41, 1.32],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false
        }
    ]
};

// Cria o contexto do canvas
const ctx = document.getElementById('meuGrafico').getContext('2d');

// Cria o gráfico de barras
const myChart = new Chart(ctx, {
    type: 'line', // Tipo do gráfico
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});