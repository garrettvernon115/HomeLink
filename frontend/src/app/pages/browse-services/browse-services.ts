import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Category {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
}

@Component({
  selector: 'app-browse-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './browse-services.html',
  styleUrl: './browse-services.scss'
})
export class BrowseServicesComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  sortOption: string = 'lowToHigh'

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/api/categories`)
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.filteredCategories = categories;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.errorMessage = 'Failed to load services';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSearchChange(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm = term;
    
    if (term) {
      this.filteredCategories = this.categories.filter(cat =>
        cat.name.toLowerCase().includes(term.toLowerCase()) ||
        cat.description.toLowerCase().includes(term.toLowerCase())
      );
    } else {
      this.filteredCategories = this.categories;
    }
  }

  sortCategories() {
    if (!this.filteredCategories) return;

    this.filteredCategories.sort((a, b) => {
      if (this.sortOption === 'lowToHigh') return (a.estimatedPriceMin ?? 0) - (b.estimatedPriceMin ?? 0);
      if (this.sortOption === 'highToLow') return (b.estimatedPriceMin ?? 0) - (a.estimatedPriceMin ?? 0);
      if (this.sortOption === 'newest') return b.id - a.id;
      if (this.sortOption === 'oldest') return a.id - b.id;
      return 0;
    });
  }

  requestService(categoryId: number, categoryName: string) {
    this.router.navigate(['/service-request/new'], {
      queryParams: { 
        categoryId: categoryId,
        categoryName: categoryName 
      }
    });
  }

  getCategoryIcon(name: string): string {
    const icons: { [key: string]: string } = {
      'plumbing':    'plumbing',
      'electrical':  'electrical_services',
      'hvac':        'ac_unit',
      'air':         'ac_unit',
      'cleaning':    'cleaning_services',
      'landscaping': 'yard',
      'lawn':        'yard',
      'painting':    'format_paint',
      'carpentry':   'handyman',
      'roofing':     'roofing',
      'pest':        'pest_control',
      'appliance':   'home_repair_service',
    };
    const key = name.toLowerCase();
    for (const k of Object.keys(icons)) {
      if (key.includes(k)) return icons[k];
    }
    return 'home_repair_service';
  }

  getCategoryBannerStyle(name: string): { [key: string]: string } {
    if (this.getCategoryLocalImage(name)) {
      return { 'background': 'linear-gradient(135deg, #1e3a8a, #2563eb)' };
    }
    return {};
  }

  getCategoryLocalImage(name: string): string | null {
    const images: { [key: string]: string } = {
      'hvac': '/hvac.png',
      'air':  '/hvac.png',
    };
    const key = name.toLowerCase();
    for (const k of Object.keys(images)) {
      if (key.includes(k)) return images[k];
    }
    return null;
  }

  getBannerClass(name: string): string {
    const themes = [
      'banner-navy', 'banner-blue', 'banner-steel',
      'banner-teal', 'banner-indigo', 'banner-slate'
    ];
    let hash = 0;
    for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
    return themes[hash % themes.length];
  }
}