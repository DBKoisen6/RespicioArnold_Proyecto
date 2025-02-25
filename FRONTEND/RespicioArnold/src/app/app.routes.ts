import { Routes } from '@angular/router';
import { PersonalComponent } from './components/personal/personal.component';

export const routes: Routes = [
    {path: 'personal', component: PersonalComponent},
    { path: '', redirectTo: 'personal', pathMatch: 'full' }, // Redirige a /personal al inicio
    { path: '**', redirectTo: 'personal' }
];
