import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAnimalComponent } from './create-animal/create-animal.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  { path: "", component: MapComponent },
  { path: "create", component: CreateAnimalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
