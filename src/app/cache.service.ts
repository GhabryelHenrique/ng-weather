import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  constructor() {}

  setItem(key: string, data: any, ttl: number): void {
    const now = new Date();
    const item = {
      data: data,
      expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  getItem(key: string): any {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}