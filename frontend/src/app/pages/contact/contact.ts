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

  onSubmit() {
    console.log('Contact Form:', this.name, this.email, this.message);

    this.successMessage = 'Message sent successfully!';

    this.name = '';
    this.email = '';
    this.message = '';
  }

}