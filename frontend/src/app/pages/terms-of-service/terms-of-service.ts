import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './terms-of-service.html',
  styleUrl: './terms-of-service.scss'
})
export class TermsOfService {

  // Today's date for "Last updated"
  today: Date = new Date();

  // Terms data - each term has a title and content
  terms = [
    {
      title: 'Acceptance of Terms',
      content: 'By using HomeLink, you agree to the Terms of Service that are stated on this page.'
    },
    {
      title: 'User Accounts',
      content: 'Users must create an account to access certain features. You are responsible for keeping your login credentials secure. Homelink is not liable for any unauthorized access to your account.'
    },
    {
      title: 'Service Providers',
      content: 'Providers must comply with all applicable laws and maintain professional standards while offering services. HomeLink does not guarantee the quality of services provided by third-party providers beyond this point.'
    },
    {
      title: 'Payment and Fees',
      content: 'Payments are processed after service completion. Any fees are clearly communicated before confirmation of any purchase or service.'
    },
    {
      title: 'Cancellation Policy',
      content: 'You can cancel a service request before it is accepted by a provider. After acceptance, contact support for cancellation options.'
    },
    {
      title: 'Limitation of Liability',
      content: 'HomeLink is not responsible for damages arising from the use of services. Use services at your own risk; if a provider causes damage, make sure to document it and report it to the legal authorities.'
    }
  ];
}