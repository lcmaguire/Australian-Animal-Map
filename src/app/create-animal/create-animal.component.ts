import { Component, OnInit } from '@angular/core';
import { doc, collection, setDoc, getFirestore, getDoc, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { geohashQuery, geohashForLocation, geohashQueryBounds } from 'geofire-common'
@Component({
  selector: 'app-create-animal',
  templateUrl: './create-animal.component.html',
  styleUrls: ['./create-animal.component.css']
})
export class CreateAnimalComponent implements OnInit {

  firestore = getFirestore();

  success = false
  errorMessage = ""

  options: google.maps.MapOptions = {
    center: { lat: -30, lng: 133.3 },
    zoom: 4,
  };

  center = { lat: -30, lng: 133.3 };
  zoom = 7

  markerPosition: google.maps.MarkerOptions = { draggable: true, position: { lat: -30, lng: 133 } }

  constructor() { }

  ngOnInit(): void {
  }

  animal = { name: "Test Yeet", description: "", "array-type": ["kangaroo"], lat: -30.1, lng: 133, hash: "", type: "kangaroo", /*timestamp: serverTimestamp()*/ }

  async submit() {
    this.animal.hash = geohashForLocation([this.animal.lat, this.animal.lng]);
    let res = await addDoc(collection(this.firestore, "cities"),
      this.animal
    )
    console.log(res)
    if (res.id != undefined) {
      this.success = true
    }
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  drag(event: google.maps.MapMouseEvent) {
    if (event.latLng?.toJSON() != undefined) {
      this.animal.lat = event.latLng?.toJSON().lat
      this.animal.lng = event.latLng?.toJSON().lng
    }
  }

}
