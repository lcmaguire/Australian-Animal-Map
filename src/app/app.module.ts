import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { NavbarComponent } from './navbar/navbar.component';
import { CreateAnimalComponent } from './create-animal/create-animal.component';
import { ViewAnimalComponent } from './view-animal/view-animal.component';
import { ListTypesComponent } from './types/list-types/list-types.component';
import { CreateTypeComponent } from './types/create-type/create-type.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavbarComponent,
    CreateAnimalComponent,
    ViewAnimalComponent,
    ListTypesComponent,
    CreateTypeComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
