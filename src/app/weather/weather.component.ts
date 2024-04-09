import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { WeatherData } from '../models/weather-data.model';

@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
    errorMessage: string = ''; // Initialize errorMessage variable
    weatherData: WeatherData[] = []; // Define the type according to the data structure from the API
    formGrp: FormGroup;
    zipCode: FormControl = new FormControl('', Validators.required)

    constructor(private weatherService: WeatherService, private formBuilder: FormBuilder) {
        this.formGrp = this.formBuilder.group({
            zipCode: this.zipCode
        })
    }

    ngOnInit(): void {
        //debugger;
        this.getWeatherDataForAllZipCodes();
    }

    private getWeatherDataForAllZipCodes(): void {
        //debugger
        const zipCodes = this.weatherService.loadZipCodes();

       zipCodes.forEach(zipCode => {
            this.weatherService.getWeatherByZipCode(zipCode)
                .subscribe( 
                    (data) => {
                        data.zipCode = zipCode;
                        this.weatherData.push(data); // Push the weather data for each zip code to the array
                    },
                    (error) => {
                        this.errorMessage = 'An error occurred while fetching weather for zip code ${zipCode}.';
                        console.error(`Error fetching weather for zip code ${zipCode}:`, error);
                    }
                );
        });
    }

    removeLocation(location: WeatherData): void {
        const index = this.weatherData.indexOf(location);
        if (index !== -1) {
            this.weatherData.splice(index, 1);
            console.log('Zip code removed:', location.zipCode);
            this.weatherService.removeZipCode(location.zipCode); // Remove the zip code from storage
        }
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

    //zipCode = new FormControl('', [Validators.required, Validators.pattern('[0-9]{5}')]);
    //errorMessage: string | null = null;

    addZipcode() {
        if (this.formGrp.controls.zipCode.value) {
            const zipCodes = JSON.parse(localStorage.getItem('zipCodes') || '[]');
            this.weatherData = [];
            zipCodes.push(this.formGrp.controls.zipCode.value);
            localStorage.setItem('zipCodes', JSON.stringify(zipCodes));
            console.log('Zip code added:', this.formGrp.controls.zipCode.value);
            this.clearInput();
        } else {
            this.errorMessage = 'Invalid zip code';
        }

        //fetch the weatherData to display current weather of all available zipcodes
        this.getWeatherDataForAllZipCodes();
        this.formGrp.reset();
    }

    clearInput() {
        this.formGrp.reset();
        this.errorMessage = null;
    }
}
