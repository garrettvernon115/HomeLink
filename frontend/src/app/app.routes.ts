import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/home/homepage.component';
import { Signup } from './signup/signup';
import { NotFound } from './not-found/not-found';
import { LoginComponent } from './pages/login/login';
import { authGuard, homeownerGuard, providerGuard, adminGuard } from './guards/auth.guard';
import { ContactComponent } from './pages/contact/contact';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works';
import { AboutComponent } from './pages/about/about';
import { FaqComponent } from './pages/faq/faq';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'home', redirectTo: '' },

  { path: 'login', component: LoginComponent }, 
  { path: 'signup', component: Signup },
  { path: 'about', component: AboutComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  // Contact page
  { path: 'contact', component: ContactComponent },
  
  // FAQ page
  { path: 'faq', component: FaqComponent },

  // Legal pages
  {
  path: 'privacy-policy',
  loadComponent: () => import('./pages/privacy-policy/privacy-policy')
    .then(m => m.PrivacyPolicy)
},
{
  path: 'terms-of-service',
  loadComponent: () => import('./pages/terms-of-service/terms-of-service')
    .then(m => m.TermsOfService)
},

  // Browse services page (public)
  {
    path: 'services',
    loadComponent: () => import('./pages/browse-services/browse-services').then(m => m.BrowseServicesComponent)
  },

  // Protected routes - require authentication
  { 
    path: 'homeowner/dashboard', 
    loadComponent: () => import('./pages/homeowner-dashboard/homeowner-dashboard').then(m => m.HomeownerDashboardComponent),
    canActivate: [homeownerGuard]
  },
  
  { 
    path: 'provider/dashboard', 
    loadComponent: () => import('./pages/provider-dashboard/provider-dashboard').then(m => m.ProviderDashboardComponent),
    canActivate: [providerGuard]
  },

  // Service request form (homeowner only)
  {
    path: 'service-request/new',
    loadComponent: () => import('./pages/service-request-form/service-request-form').then(m => m.ServiceRequestFormComponent),
    canActivate: [homeownerGuard]
  },

  // Profile edit page (authenticated users)
  {
    path: 'profile-edit',
    loadComponent: () => import('./pages/profile-edit/profile-edit').then(m => m.ProfileEditComponent),
    canActivate: [authGuard]
  },

  // Password change page
  {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/password-change')
      .then(m => m.PasswordChangeComponent),
    canActivate: [authGuard]
  },

  // Payment page (homeowner only)
  {
    path: 'payment/:serviceRequestId',
    loadComponent: () => import('./pages/payment/payment')
      .then(m => m.PaymentComponent),
    canActivate: [authGuard, homeownerGuard]
  },

  // Admin dashboard (admin only)
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard')
      .then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },

  // Generic authenticated route
  { 
    path: 'dashboard', 
    redirectTo: '',
    canActivate: [authGuard]
  },

  { path: '404', component: NotFound },
  { path: '**', redirectTo: '/404' }
];
