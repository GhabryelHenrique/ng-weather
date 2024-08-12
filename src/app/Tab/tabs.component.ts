// tabs.component.ts
import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { LocationService } from 'app/location.service';
import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs">
      <div class="tab-titles">
        <!-- Loop through each tab and display its title. Add click event to select the tab and close button to remove the tab -->
        <div *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
          {{ tab.title }}
          <span class="close" (click)="closeTab(tab, $event)">&times;</span>
        </div>
      </div>
      <!-- Placeholder for the content of the selected tab -->
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
  // Query to get all TabComponent instances within the content of this component
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor(private locationService: LocationService) {}

  // Lifecycle hook that is called after the component's content has been fully initialized
  ngAfterContentInit() {
    // Check if there are any active tabs, if not, activate the first tab
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  // Method to select a tab and mark it as active
  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach(t => t.active = false);
    tab.active = true;
  }

  // Method to close a tab and remove it from the list
  closeTab(tab: TabComponent, event: MouseEvent) {
    // Prevent the click event from propagating to the parent elements
    event.stopPropagation();
    const tabArray = this.tabs.toArray();
    const index = tabArray.indexOf(tab);
    // Remove the location associated with the tab
    this.locationService.removeLocation(tab.zip);
    // Remove the tab from the array
    tabArray.splice(index, 1);
    // If the closed tab was active, activate the previous tab or the first tab if it was the first one
    if (tab.active && tabArray.length > 0) {
      this.selectTab(tabArray[Math.max(index - 1, 0)]);
    }
  }
}