import { Component, OnInit, ViewChild } from '@angular/core';
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";

import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  firestore = getFirestore();

  options: google.maps.MapOptions = {
    center: { lat: -30, lng: 133.3 },
    zoom: 4
  };

  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.addDoc()
  }

  async addDoc() {
    // Add a new document in collection "cities"
    await setDoc(doc(this.firestore, "cities", "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    });
    this.getDocs()
  }

  async getDocs() {
    const docRef = doc(this.firestore, "cities", "LA");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPositions.push(event.latLng.toJSON());
    }

  }

  openInfoWindow(marker: MapMarker) {
    if (this.infoWindow != undefined) {
      this.infoWindow.open(marker);
    }
  }

}
