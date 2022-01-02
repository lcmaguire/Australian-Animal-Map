import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAnimalComponent } from './create-animal/create-animal.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { ListTypesComponent } from './types/list-types/list-types.component';
import { ViewAnimalComponent } from './view-animal/view-animal.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "search", component: MapComponent },
  { path: "create", component: CreateAnimalComponent },
  { path: "animals", component: ListTypesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
