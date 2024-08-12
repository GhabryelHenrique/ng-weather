import { Injectable } from '@angular/core';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { Forecast } from './forecasts-list/forecast.type';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  constructor() {}

  // Stores an item in localStorage with a specific time-to-live (TTL)
  setItem(key: string, data: Forecast | CurrentConditions, ttl: number): void {
    const now = new Date();
    const item = {
      data: data,
      expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item)); // Save the item in localStorage as a JSON string
  }

  // Retrieves an item from localStorage if it hasn't expired
  getItem(key: string): Forecast | CurrentConditions {
    const itemStr = localStorage.getItem(key); // Get the item as a string from localStorage
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      // If the current time is past the expiry time, remove the item and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.data; // Return the stored data if it hasn't expired
  }

  // Removes a specific item from localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clears all items from localStorage
  clear(): void {
    localStorage.clear();
  }
}
