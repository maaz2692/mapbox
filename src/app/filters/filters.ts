import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatCheckboxModule, MatDividerModule ],
  templateUrl: './filters.html',
  styleUrl: './filters.scss'
})
export class Filters implements OnInit, OnChanges {
  @Input() name?: string;
  @Input() options: Array<{ id: number; name: string }> = [];
  @Input() initialSelection: string = '';
  @Output() selectionChange = new EventEmitter<
    Array<{ id: number; name: string }>
  >();

  selectedOptions: Array<{ id: number; name: string }> = [];
  filteredOptions: Array<{ id: number; name: string }> = [];

  isAllSelected = false;
  menuShouldClose = true;

  displayNameMap: { [key: string]: string } = {
    "C1 - Toronto": "Downtown Central, Entertainment District and Waterfront communities",
    "C2 - Toronto": "Annex, Yorkville, Yonge/St Clair",
    "C3 - Toronto": "Forest Hill South, Yonge Eglinton",
    "C4 - Toronto": "Bedford Park, Forest Hill North, Lawrence Park N/S",
    "C6 - Toronto": "Bathurst Manor, Clanton Park",
    "C7 - Toronto": "Willowdale & Newtonbrook West",
    "C8 - Toronto": "Downtown East & Regent Park",
    "C9 - Toronto": "Rosedale Moore Park",
    "C10 - Toronto": "Mount Pleasant E/W",
    "C11 - East York": "Leaside, Thorncliffe & Flemington Park",
    "C12 - North York": "York Mills & Bridle Path",
    "C13 - North York": "Don Mills & Victoria Village",
    "C14 - North York": "Newtonbrooke E & Willowdale E",
    "C15 - North York": "Bayview, Don Valley & Hill Crest Village",
    "E1 - Toronto": "N/S Riverdale & Green Wood-Coxwell",
    "E2 - Toronto": "The Beaches, East End Danforth & Woodbine Corridor",
    "E3 - East York": "East York & Danforth Village",
    "E4 - Scarborough": "Dorset & Kennedy Park, Wexford-Maryvale, Ionview - Birchmount",
    "E5 - Scarborough": "Steeles, Tam O'Shanter and Sullivan",
    "E6 - Scarborough": "Birch Cliff, Cliffside & Oakridge",
    "E8 - Scarborough": "Scarborough Village, Guildwood, Eglinton E",
    "E9 - Scarborough": "Woburn, Morningside & Bendale",
    "E10 - Scarborough": "Rouge, Port Union & Highland Creek",
    "E11 - Scarborough": "Malvern & Rouge",
    "W1 - Toronto": "High Park, South Parkdale, & Roncesvalles",
    "W2 - Toronto/York": "Baby Point, Dovercourt- Junction, High Park N, Runnymede-Bloor W",
    "W3 - Toronto/York": "Keelesdale-Eglinton W, Rockcliffe–Smythe, Weston-Pelham Park, Corso Italia, Caledonia",
    "W4 - North York/York": "Pelmo Park – Humberlea, Weston, Briar Hill, Maple Leaf, Mount Dennis Yorkdale",
    "W5 - North York": "Downsview, Humber Summit, York University Heights",
    "W6 - Etobicoke": "New Toronto, Long Branch, Mimico, Alderwood",
    "W7 - Etobicoke": "Stonegate - Queenway",
    "W8 - Etobicoke": "Kingsway S, Central Etobicoke, Islington–City Centre West, West Mall",
    "W9 - Etobicoke": "Kingsview Village, Humber Heights, Willowridge",
    "W10 - Etobicoke": "Rexdale, West Humber"
  };

  sortFilteredOptionsByDisplayName() {
    this.filteredOptions.sort((a, b) => {
      const nameA = this.displayNameMap[a.name] || a.name;
      const nameB = this.displayNameMap[b.name] || b.name;
      return nameA.localeCompare(nameB);
    });
  }

  ngOnInit() {
    this.filteredOptions = [...this.options];
    this.sortFilteredOptionsByDisplayName();
    setTimeout(() => {
      this.filter(''); // Filter immediately after initialization

    },4000)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.initialSelection) {
      this.selectInitialOption();
    }

    if (changes['options'] && this.options.length) {
      this.filteredOptions = [...this.options];
      this.sortFilteredOptionsByDisplayName();
      if (this.initialSelection) {
        this.selectInitialOption();
      }
      // this.filter(''); // Reapply filter on option changes
    }
  }

  selectInitialOption(): void {
    const selectedOption = this.options.find(
      (option) => option.name === this.initialSelection
    );

    if (selectedOption) {

      this.selectedOptions = [selectedOption];
      this.emitSelectionChange(); // Emit selection change event
      this.updateFilteredOptions();
    }
  }

  toggleSelection(optionId: number, optionName: string): void {
    const index = this.selectedOptions.findIndex((opt) => opt.id === optionId);
    if (index === -1) {
      this.selectedOptions.push({ id: optionId, name: optionName });
    } else {
      this.selectedOptions.splice(index, 1);
    }
    this.updateFilteredOptions();
    this.emitSelectionChange();
  }

  toggleSelectAll(): void {
    if (this.isAllSelected) {
      this.selectedOptions = [];
    } else {
      this.selectedOptions = [...this.options];
    }
    this.isAllSelected = !this.isAllSelected;
    this.updateFilteredOptions();
    this.emitSelectionChange();
  }

  emitSelectionChange(): void {
    this.selectionChange.emit(this.selectedOptions);
  }

  isSelected(optionId: number): boolean {
    return this.selectedOptions.some((opt) => opt.id === optionId);
  }

  clearSelections(): void {
    this.selectedOptions = [];
    this.isAllSelected = false;
    this.updateFilteredOptions();
    this.emitSelectionChange();
  }

  filter(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.updateFilteredOptions();
  }

  updateFilteredOptions(): void {
    const selectedIds = this.selectedOptions.map((opt) => opt.id);
    const unselectedOptions = this.filteredOptions.filter(
      (opt) => !selectedIds.includes(opt.id)
    );

    this.filteredOptions = [...this.selectedOptions, ...unselectedOptions];
  }
}

