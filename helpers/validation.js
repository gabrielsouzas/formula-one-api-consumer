export function validateLapTime(laptimes, plusAverage) {
    // Calcula a média dos dados
    const average = laptimes.reduce((sum, value) => sum + value, 0) / laptimes.length;

    // Define um limite para considerar valores como extremos
    const outlierThreshold = average * plusAverage;

    // Filtra os dados para remover valores extremos
    const filteredData = laptimes.filter(value => value <= outlierThreshold);

    return filteredData; // Retorna os dados sem os valores extremos
}