// tab.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tab',
  template: `
    <div *ngIf="active" class="tab-content">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .tab-content {
      padding: 10px;
      border: 1px solid #ccc;
      border-top: none;
    }
  `]
})
export class TabComponent {
  @Input() title: string;
  @Input() zip: string;
  @Input() active = false;
  @Output() close = new EventEmitter<void>();
}