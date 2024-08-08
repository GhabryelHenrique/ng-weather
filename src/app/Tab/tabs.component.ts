// tabs.component.ts
import { Component, ContentChildren, QueryList, AfterContentInit, Signal } from '@angular/core';
import { TabComponent } from './tab.component';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { WeatherService } from 'app/weather.service';
import { LocationService } from 'app/location.service';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs">
      <div class="tab-titles">
        <div *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
          {{ tab.title }}
          <span class="close" (click)="closeTab(tab, $event)">&times;</span>
        </div>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .tabs {
      border: 1px solid #ccc;
    }
    .tab-titles {
      display: flex;
      border-bottom: 1px solid #ccc;
    }
    .tab-titles div {
      padding: 10px;
      cursor: pointer;
    }
    .tab-titles div.active {
      background-color: #f1f1f1;
      border-bottom: 1px solid white;
    }
    .close {
      margin-left: 10px;
      color: red;
      cursor: pointer;
    }
  `]
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor(private locationService: LocationService){}

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach(t => t.active = false);
    tab.active = true;
  }

  closeTab(tab: TabComponent, event: MouseEvent) {
    event.stopPropagation();
    const tabArray = this.tabs.toArray();
    const index = tabArray.indexOf(tab);
    this.locationService.removeLocation(tab.zip)
    tabArray.splice(index, 1);
    if (tab.active && tabArray.length > 0) {
      this.selectTab(tabArray[Math.max(index - 1, 0)]);
    }
  }
}