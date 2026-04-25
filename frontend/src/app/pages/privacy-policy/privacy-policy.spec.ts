import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './privacy-policy.html',
  styleUrls: ['./privacy-policy.scss'],
  encapsulation: ViewEncapsulation.None  // <-- crucial for your CSS to apply
})
export class PrivacyPolicy {
  today: Date = new Date();

  policies = [
    { title: 'Information Collection', content: 'We collect personal information when you create an account or use our services.' },
    { title: 'Use of Information', content: 'Your information is used to provide services, improve the platform, and communicate important updates.' },
    { title: 'Data Security', content: 'We use industry-standard security measures to protect your information.' },
    { title: 'Cookies', content: 'Our website uses cookies to enhance user experience and track analytics.' },
    { title: 'Third-Party Services', content: 'We may share information with trusted third-party service providers as needed.' },
    { title: 'User Rights', content: 'You may request to access, update, or delete your personal information.' }
  ];
}