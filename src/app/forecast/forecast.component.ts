import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../weather.service';
import { CityInfo, ForecastData, ForecastEntry } from '../models/forecast-data.model';

@Component({
    selector: 'app-forecast',
    templateUrl: './forecast.component.html',
    styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
    zipcode: string;
    forecastData: ForecastData;
    forecastDataEntry: ForecastEntry[] = [];
    city: CityInfo;

    constructor(private route: ActivatedRoute, private weatherService: WeatherService, private router: Router) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.zipcode = params['zipcode'];
            this.fetchForecastData(this.zipcode);
        });
    }

    fetchForecastData(zipcode: string): void {
        this.weatherService.getForecast(zipcode).subscribe(
            (data) => {
            this.forecastDataEntry = [];
            console.log('Received forecast data:', data);
            this.zipcode = zipcode;
            this.forecastDataEntry = data.list || [];
            this.city = data.city || [];

                // Group entries by day
            const groupedData = this.groupByDay(data.list);

            // Calculate daily statistics
                this.forecastDataEntry = this.calculateDailyStats(groupedData);
        });
    }

    groupByDay(entries: ForecastEntry[]): ForecastEntry[] {
        const groupedData= [];
        for (const entry of entries) {
            const date = new Date(entry.dt * 1000); // Convert timestamp to Date object
            const day = date.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
            if (!groupedData[day]) {
                groupedData[day] = [];
            }
            groupedData[day].push(entry);
        }
        return groupedData;
    }

    calculateDailyStats(groupedData: any): ForecastEntry[] {
        const dailyStats = [];
        for (const day in groupedData) {
            if (Object.prototype.hasOwnProperty.call(groupedData, day)) {
                const entries = groupedData[day];
                const minTemp = Math.min(...entries.map(entry => entry.main.temp_min));
                const maxTemp = Math.max(...entries.map(entry => entry.main.temp_max));
                const avgTemp = entries.reduce((acc, entry) => acc + entry.main.temp, 0) / entries.length;
                const weatherMain = entries[0].weather[0].main;
                dailyStats.push({ date: day, minTemp, maxTemp, avgTemp });
            }
        }
        return dailyStats;
    }

    goBack(): void {
        this.router.navigate(['/']);
    }

    getWeatherIconUrl(description: string): string {
        const baseUrl = 'https://www.angulartraining.com/images/weather/';
        switch (description) {
            case 'clear':
                return baseUrl + 'sun.png';
            case 'clouds':
                return baseUrl + 'clouds.png';
            case 'rain':
                return baseUrl + 'rain.png';
            case 'snow':
                return baseUrl + 'snow.png';
            default:
                return baseUrl + 'sun.png'; // Default icon or handle other weather conditions
        }
    }
}
