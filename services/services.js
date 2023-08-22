export const fetchDrivers = async (year) => {
    const response = await fetch(`http://ergast.com/api/f1/${year}/drivers.json`);
    if (response.ok) {
        const drivers = await response.json();
        if (drivers) {
            console.log(drivers);
        }
    } else {
        
    }

    //const data = await response.json();

    //console.log(data['MRData']['DriverTable']['Drivers'][1]);
}