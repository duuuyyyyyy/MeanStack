import "zone.js"; // enable zone-based change detection for HttpClient callbacks
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection(),
    importProvidersFrom(ReactiveFormsModule)
  ]
}).catch(err => console.error(err));
