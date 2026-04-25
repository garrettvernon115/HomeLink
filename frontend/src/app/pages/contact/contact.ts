import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {

  name = '';
  email = '';
  message = '';
  successMessage = '';
  errorMessage = '';

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim() || !this.email.trim() || !this.message.trim()) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.successMessage = 'Message sent successfully!';
    this.name = '';
    this.email = '';
    this.message = '';
  }

}