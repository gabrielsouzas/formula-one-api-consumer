var protocolType = 'https';

export const fetchDrivers = async (year, round) => {
    try {
        const response = await fetch(`${protocolType}://ergast.com/api/f1/${year}/${round}/drivers.json?limit=2`); //?limit=2
    if (response.ok) {
        const drivers = await response.json();
        if (drivers) {
            return drivers['MRData']['DriverTable']['Drivers'];
        } else {
            return {
                error: 'Erro ao converter dados retornados.',
                status: response.status,
                message: response.statusText
            };
        }
    } else {
        return {
            error: 'Erro na requisição',
            status: response.status,
            message: response.statusText
        };
    }
    } catch (error) {
        if (protocolType === 'https') {
            protocolType = 'http';
            try {
                fetchDrivers(year, round);
            } catch (error) {
                return {error};
            }
        }
        return {error};
    }
}

export const fetchDriverConstructor = async (year, driver) => {
    try {
        const response = await fetch(`${protocolType}://ergast.com/api/f1/${year}/drivers/${driver}/constructors.json`);
    if (response.ok) {
        const driverConstructor = await response.json();
        if (driverConstructor) {
            return driverConstructor.MRData.ConstructorTable.Constructors[0].constructorId;
        } else {
            return {
                error: 'Erro ao converter dados retornados.',
                status: response.status,
                message: response.statusText
            };
        }
    } else {
        return {
            error: 'Erro na requisição',
            status: response.status,
            message: response.statusText
        };
    }
    } catch (error) {
        if (protocolType === 'https') {
            protocolType = 'http';
            try {
                fetchDriverConstructor(year, driver);
            } catch (error) {
                return {error};
            }
        }
        return {error};
    }
}

export const fetchLapTime = async (year, round, driver) => {
    try {
        const response = await fetch(`${protocolType}://ergast.com/api/f1/${year}/${round}/drivers/${driver}/laps.json?limit=100`);
        if (response.ok) {
            const laptimes = await response.json();
            if (laptimes) {
                return laptimes['MRData'];
            } else {
                return {
                    error: 'Erro ao converter dados retornados.',
                    status: response.status,
                    message: response.statusText
                };
            }
        } else {
            return {
                error: 'Erro na requisição',
                status: response.status,
                message: response.statusText
            };
        }
    } catch (error) {
        if (protocolType === 'https') {
            protocolType = 'http';
            try {
                fetchLapTime(year, round, driver);
            } catch (error) {
                return {error};
            }
        }
        return {error};
    }
}

export const fetchRaceSchedule = async (year = 'current') => {
    try {
        const response = await fetch(`${protocolType}://ergast.com/api/f1/${year}.json`);
        if (response.ok) {
            const races = await response.json();
            if (races) {
                return races.MRData.RaceTable.Races;
            } else {
                return {
                    error: 'Erro ao converter dados retornados.',
                    status: response.status,
                    message: response.statusText
                };
            }
        } else {
            return {
                error: 'Erro na requisição',
                status: response.status,
                message: response.statusText
            };
        }
    } catch (error) {
        if (protocolType === 'https') {
            protocolType = 'http';
            try {
                fetchRaceSchedule(year);
            } catch (error) {
                return {error};
            }
        }
        return {error};
    }
}

export const fetchRaceResult = async (year = 'current', round = 'last') => {
    try {
        const response = await fetch(`${protocolType}://ergast.com/api/f1/${year}/${round}/results.json`);
        if (response.ok) {
            const races = await response.json();
            if (races) {
                return races.MRData;
            } else {
                return {
                    error: 'Erro ao converter dados retornados.',
                    status: response.status,
                    message: response.statusText
                };
            }
        } else {
            return {
                error: 'Erro na requisição',
                status: response.status,
                message: response.statusText
            };
        }
    } catch (error) {
        if (protocolType === 'https') {
            protocolType = 'http';
            try {
                fetchRaceSchedule(year);
            } catch (error) {
                return {error};
            }
        }
        return {error};
    }
}

export const fetchDriversStandings = async (year) => {
    try {
        const response = await fetch(`${protocolType}://ergast.com/api/f1/${year}/driverStandings.json`);
        if (response.ok) {
            const drivers = await response.json();
            if (drivers) {
                return drivers.MRData.StandingsTable.StandingsLists[0].DriverStandings;
            } else {
                return {
                    error: 'Erro ao converter dados retornados.',
                    status: response.status,
                    message: response.statusText
                };
            }
        } else {
            return {
                error: 'Erro na requisição',
                status: response.status,
                message: response.statusText
            };
        }
    } catch (error) {
        if (protocolType === 'https') {
            protocolType = 'http';
            try {
                fetchDriversStandings(year);
            } catch (error) {
                return {error};
            }
        }
        return {error};
    }
}

export const fetchConstructorsStandings = async (year) => {
    try {
        const response = await fetch(`${protocolType}://ergast.com/api/f1/${year}/constructorStandings.json`);
        if (response.ok) {
            const constructors = await response.json();
            if (constructors) {
                return constructors.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
            } else {
                return {
                    error: 'Erro ao converter dados retornados.',
                    status: response.status,
                    message: response.statusText
                };
            }
        } else {
            return {
                error: 'Erro na requisição',
                status: response.status,
                message: response.statusText
            };
        }
    } catch (error) {
        if (protocolType === 'https') {
            protocolType = 'http';
            try {
                fetchConstructorsStandings(year);
            } catch (error) {
                return {error};
            }
        }
        return {error};
    }
}