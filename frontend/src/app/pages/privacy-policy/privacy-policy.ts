import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- HERO SECTION -->
    <section class="hero">
      <h1>Privacy Policy</h1>
      <p>Last updated: {{ today | date:'longDate' }}</p>
    </section>

    <!-- PRIVACY CARDS -->
    <section class="container">
      <div class="cards">
        <div class="card" *ngFor="let item of policies">
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="cta">
      <h2>Questions about our privacy policy?</h2>
      <p>Reach out to us anytime for more information.</p>
      <a routerLink="/contact" class="cta-button">Contact Us</a>
    </section>
  `,
  styles: [`
    /* HERO SECTION */
    .hero {
      background: linear-gradient(135deg, #1e3a8a, #2563eb);
      color: white;
      padding: 100px 20px;
      text-align: center;
    }
    .hero h1 {
      font-size: 50px;
      margin-bottom: 15px;
    }
    .hero p {
      font-size: 22px;
      opacity: 0.9;
    }

    /* PRIVACY CARDS SECTION */
    .container {
      padding: 60px 20px;
      background: #f9fafb;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* 3 cards per row */
      gap: 25px;
      margin: 0 auto;
    }
    .card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease;
    }
    .card h3 {
      margin-bottom: 12px;
      font-size: 20px;
    }
    .card p {
      color: #555;
      font-size: 16px;
      line-height: 1.6;
    }
    .card:hover {
      transform: translateY(-8px);
    }

    /* CTA SECTION */
    .cta {
      text-align: center;
      padding: 80px 20px;
      background: linear-gradient(135deg, #2563eb, #1e3a8a);
      color: white;
      margin-top: 40px;
    }
    .cta h2 {
      font-size: 36px;
      margin-bottom: 15px;
    }
    .cta p {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 30px;
    }
    .cta .cta-button {
      display: inline-block;
      background: white;
      color: #1e3a8a;
      padding: 15px 35px;
      font-size: 18px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      transition: 0.3s ease;
    }
    .cta .cta-button:hover {
      transform: scale(1.05);
    }

    /* RESPONSIVE GRID */
    @media (max-width: 1024px) {
      .cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PrivacyPolicy {
  today: Date = new Date();

  policies = [
    { title: 'Information Collection', content: 'We collect personal information when you create an account or use our services. This includes your name, email address, and other contact details.' },
    { title: 'Use of Information', content: 'Your information is used to provide services, improve the platform, and communicate important updates. We may also use this information for marketing purposes, subject to your preferences.' },
    { title: 'Data Security', content: 'We use industry-standard security measures to protect your information such as encryption, secure servers, and access controls.' },
    { title: 'Cookies', content: 'Our website uses cookies to enhance user experience and track analytics. You can manage your cookie preferences at any time.' },
    { title: 'Third-Party Services', content: 'We may share information with trusted third-party service providers as needed. This includes names and contact details.' },
    { title: 'User Rights', content: 'You may request to access, update, or delete your personal information. If you wish to do so, please contact us on the contact page.' }
  ];
}