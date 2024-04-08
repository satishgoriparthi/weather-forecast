import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../weather.service';

@Component({
    selector: 'app-forecast',
    templateUrl: './forecast.component.html',
    styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
    zipcode: string;
    cityName: string;
    forecastData: any[]; // Define the type according to the data structure from the API

    constructor(private route: ActivatedRoute, private weatherService: WeatherService, private router: Router) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.zipcode = params['zipcode'];
            this.fetchForecastData(this.zipcode);
        });
    }

    fetchForecastData(zipcode: string): void {
        this.weatherService.getForecast(zipcode).subscribe(data => {
            data.zipCode = zipcode;
            this.forecastData = data;
        });
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
