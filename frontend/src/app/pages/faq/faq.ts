import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class FaqComponent {

  faqs = [
  {
    question: 'What is HomeLink?',
    answer: 'HomeLink is an online platform that connects homeowners with local service providers for a wide range of home services. Our mission is to make it easy and convenient for homeowners to find trusted professionals for their home improvement and maintenance needs.'
  },
  {
    question: 'How do I book a service?',
    answer: 'You can browse services and submit a service request through the browse services page. Here you will be able to see the specific severvices offered by providers in your area and submit a request for the service you need.'
  },
  {
    question: 'Is HomeLink free to use?',
    answer: 'Yes, homeowners and service providers can create accounts and use HomeLink for free. We only charge a fee once a service is completed. There are no upfront costs or subscription fees for using HomeLink.'
  },
  {
    question: 'How do providers get paid?',
    answer: 'Providers are paid directly for the services they complete. Once the homeowner confirms the service is completed, the payment is processed and sent to the provider.'
  },
  {
    question: 'What should I do if I encounter an issue?',
    answer: 'If you experience any issues while using HomeLink, you can use the contact page to reach out for support. Our team will review your message and respond as soon as possible.'
  },
  {
    question: 'Can I cancel a service request?',
    answer: 'Yes, you can cancel a request from your dashboard before it is accepted by a provider. Once a provider accepts the request, you will need to contact support to cancel the request and discuss any potential fees or refunds.'
  },
  {
    question: 'What if I am not satisfied with the service?',
    answer: 'If you are not satisfied with the service provided, you can contact our support team through the contact page. We will work with you to resolve the issue and ensure your satisfaction. Partial refunds may or may not be offered depending on the situation.'
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Yes, HomeLink follows best practices to keep your data safe and secure. This includes encryption, secure servers, and regular security audits. We are committed to protecting your privacy and ensuring that your information is handled with care.'
  },
  {
    question: 'Can I contact a provider directly?',
    answer: 'Yes, once a request is accepted, you can communicate with the provider with any extra details you wish to provide to them. The provider will also be able to contact you if they have any questions about the service request.'
  },
  {
    question: 'What types of services are available?',
    answer: 'HomeLink offers a wide range of home services including cleaning, repairs, installations, and maintenance. You can browse the available services on the browse services page to see what providers in your area offer.'
  }
];

}