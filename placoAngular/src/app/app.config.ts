import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Importaciones de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

// Importación del archivo de entorno
import { environment } from '../environments/environtment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(), 
    provideAnimationsAsync(),
    
    // Configuración de Firebase (una sola vez)
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore())
  ]
};