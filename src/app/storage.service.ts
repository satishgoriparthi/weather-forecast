import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    saveZipCodes(zipCodes: string[]): void {
        const uniqueZipCodes = zipCodes.filter(zipCode => this.isValidZipCode(zipCode))
            .filter((value, index, self) => self.indexOf(value) === index);
        console.log('uniqueZipCodes: ', uniqueZipCodes);
        // Load existing ZIP codes from local storage
        const existingZipCodes = this.getZipCodes();
        console.log('existingZipCodes: ', existingZipCodes);
        // Merge the new ZIP codes with the existing ones, removing duplicates
        const mergedZipCodes = [...new Set([...existingZipCodes, ...uniqueZipCodes])];
        console.log('mergedZipCodes: ', mergedZipCodes);
        // Save the filtered ZIP codes to local storage
        localStorage.setItem('zipCodes', JSON.stringify(mergedZipCodes));
    }

    getZipCodes(): string[] {
        //localStorage.clear();
        const storedZipCodes = localStorage.getItem('zipCodes');
        if (storedZipCodes) {
            // Parse the stored ZIP codes from local storage
            const zipCodes: string[] = JSON.parse(storedZipCodes);
            console.log('storedZipCodes: ', storedZipCodes);
            // Filter out invalid ZIP codes and remove duplicates
            const validUniqueZipCodes = [...new Set(zipCodes.filter(zipCode => this.isValidZipCode(zipCode)))];
            console.log('validUniqueZipCodes: ', validUniqueZipCodes);
            return validUniqueZipCodes;
        } else {
            return [];
        }
    }

    // Function to validate a ZIP code format (5 digits)
     isValidZipCode(zipCode: string): boolean {
        const zipCodePattern = /^\d{5}$/;
        return zipCodePattern.test(zipCode);
    }
}