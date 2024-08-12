import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {

  private locations: string[] = [];
  private locationsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  locations$ = this.locationsSubject.asObservable();

  // Constructor to initialize the service by loading stored locations from localStorage
  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
      this.locationsSubject.next(this.locations);
    }
  }

  // Method to add a new location, update localStorage, and emit the updated state
  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.locationsSubject.next(this.locations);
  }

  // Method to remove an existing location, update localStorage, and emit the updated state
  removeLocation(zipcode: string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.locationsSubject.next(this.locations);
    }
  }
}