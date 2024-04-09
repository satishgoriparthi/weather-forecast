import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { WeatherData } from './models/weather-data.model';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private apiUrl = 'https://api.openweathermap.org/data/2.5/';
    private apiKey = '5a4b2d457ecbef9eb2a71e480b947604'; // Replace with your OpenWeatherMap API key
    private zipCodes: string[] = [];

    constructor(private http: HttpClient, private storageService: StorageService) { }

    // Method to load zip codes from local storage
    loadZipCodes()  {
        this.zipCodes = this.storageService.getZipCodes();
        return this.zipCodes;
    }

    // Method to save zip codes to local storage
    private saveZipCodes(): void {
        this.storageService.saveZipCodes(this.zipCodes);
    }

    // Method to add zip code
    addZipCode(zipCode: string): void {
        this.zipCodes.push(zipCode);
        this.saveZipCodes();
    }

    // Method to remove zip code
    removeZipCode(zipCode: string): void {
        const index = this.zipCodes.indexOf(zipCode);
        if (index !== -1) {
            this.zipCodes.splice(index, 1);
            this.saveZipCodes();
        }
    }

    getWeatherByZipCode(zipCode: string): Observable<any> {
        const url = `${this.apiUrl}weather?zip=${zipCode},us&appid=${this.apiKey}&units=metric`;
        return this.http.get(url).pipe(
            catchError(error => {
                console.error('Error fetching weather data:', error);
                return throwError('Something went wrong while fetching weather data.');
            })
        );
    }

    getForecast(zipcode: string): Observable<any> {
        const url = `${this.apiUrl}forecast?zip=${zipcode}&appid=${this.apiKey}`;
        return this.http.get(url).pipe(
            catchError(error => {
                console.error('Error fetching weather Forecast:', error);
                return throwError('Something went wrong while fetching weather Forecast.');
            })
        );
    }
}