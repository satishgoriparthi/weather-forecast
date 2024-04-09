export interface ForecastData {
    cod: string;
    message: number;
    cnt: number;
    list: ForecastEntry[];
    city: CityInfo;
}

export interface ForecastEntry {
    dt: number;
    maxTemp: number;
    minTemp: number;
    date: number;
    weatherMain: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };
    weather: Weather[];
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
        '3h': number;
    };
    sys: {
        pod: string;
    };
    dt_txt: string;
}

export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface CityInfo {
    id: number;
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}
