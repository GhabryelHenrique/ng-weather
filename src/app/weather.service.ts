import { Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { CacheService } from './cache.service';

@Injectable()
export class WeatherService {

  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  static CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient, private locationService: LocationService, private cacheService: CacheService) {
    this.locationService.locations$.subscribe(locations => {
      this.updateWeatherConditions(locations);
    });
  }

  private updateWeatherConditions(locations: string[]): void {
    this.currentConditions.update(() => []); // Clear current conditions
    for (let loc of locations) {
      this.addCurrentConditions(loc);
    }
  }

  addCurrentConditions(zipcode: string): void {
    const cacheKey = `currentConditions_${zipcode}`;
    const cachedData = this.cacheService.getItem(cacheKey);
    if (cachedData) {
      this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data: cachedData }]);
    } else {
      this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
        .subscribe(data => {
          this.cacheService.setItem(cacheKey, data, WeatherService.CACHE_TTL);
          this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]);
        });
    }
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update(conditions => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode)
          conditions.splice(+i, 1);
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const cacheKey = `forecast_${zipcode}`;
    const cachedData = this.cacheService.getItem(cacheKey);
    if (cachedData) {
      return new Observable(observer => {
        observer.next(cachedData);
        observer.complete();
      });
    } else {
      return new Observable(observer => {
        this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
          .subscribe(data => {
            this.cacheService.setItem(cacheKey, data, WeatherService.CACHE_TTL);
            observer.next(data);
            observer.complete();
          });
      });
    }
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }
}