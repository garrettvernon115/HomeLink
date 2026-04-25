import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
  sortOption: string = 'low-to-high'

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>('http://localhost:8080/api/categories')
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.filteredCategories = categories;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.errorMessage = 'Failed to load services';
          this.isLoading = false;
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
    const priceA = a.estimatedPriceMin ?? 0;
    const priceB = b.estimatedPriceMin ?? 0;

    if (this.sortOption === 'low-to-high') {
      return priceA - priceB;
    } else {
      return priceB - priceA;
    }
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
    // Return the first letter of the category name as a placeholder
    return name.charAt(0).toUpperCase();
  }
}