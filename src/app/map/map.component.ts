import { Component, OnInit, ViewChild } from '@angular/core';
import { doc, collection, setDoc, getFirestore, getDoc, addDoc, getDocs } from "firebase/firestore";

import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { geohashQuery, geohashForLocation, geohashQueryBounds } from 'geofire-common'

import { query, orderBy, limit, where, startAt, endAt } from "firebase/firestore";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  infoContent = "" // todo try this with @ViewChild like above with obj or map of obj
  firestore = getFirestore();

  options: google.maps.MapOptions = {
    center: { lat: -30, lng: 133.3 },
    zoom: 4,
    streetViewControl: false
  };

  center = { lat: -30, lng: 133.3 };
  zoom = 9

  markerOptions: google.maps.MarkerOptions[] = []
  markerPositions: google.maps.LatLngLiteral[] = [];
  markers: google.maps.Marker[] = []

  constructor() {
  }

  ngOnInit(): void {
    //this.seed();
    this.getSeededDocs()
  }

  async addSeedDoc() {
    // Add a new document in collection "cities"
    await setDoc(doc(this.firestore, "cities", "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    });
    this.getSeededDocs()
  }

  async getSeededDocs() {
    console.log("start")
    // Find cities within 50km of London
    this.markerOptions = []
    const center = [Number(this.options.center?.lat), Number(this.options.center?.lng)];
    const radiusInM = 50 * 1000;

    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geohashQueryBounds(center, radiusInM);
    for (const b of bounds) {
      const citiesRef = collection(this.firestore, "cities")
      const q = query(citiesRef, where("array-type", "array-contains", "kangaroo"), orderBy("hash"), startAt(b[0]), endAt(b[1]));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let temp = { lat: doc.data().lat, lng: doc.data().lng, }
        let markO = { draggable: false, title: `Hash is ${doc.data().hash}`, position: temp };
        this.markerOptions.push(markO)
      });
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPositions.push(event.latLng.toJSON());
    }

  }

  openInfoWindow(marker: MapMarker, info: any) {
    if (this.infoWindow != undefined) {
      console.log(marker)
      this.infoContent = info
      this.infoWindow.open(marker);
    }
  }

  seed() {
    // Compute the GeoHash for a lat/lng point
    const lat = -30;
    const lng = 133;
    const hash = geohashForLocation([lat, lng]);
    let data = { lat, lng, hash }

    // Add the hash and the lat/lng to the document. We will use the hash
    // for queries and the lat/lng for distance comparisons.
    const newCityRef = doc(collection(this.firestore, "cities"));
    const londonRef = setDoc(newCityRef, data)

    /*this.firestore.collection('cities').doc('LON');
    londonRef.update({
      geohash: hash,
      lat: lat,
      lng: lng
    }).then(() => {
      // ...
    });*/
  }


  mapDragend(a: GoogleMap) {
    console.log(a.getCenter()?.toJSON())
    this.options.center = a.getCenter()?.toJSON()
    this.center = { lat: Number(a.getCenter()?.toJSON().lat), lng: Number(a.getCenter()?.toJSON().lng), }
  }

  search(){
    console.log("here")
    this.getSeededDocs()
  }
}
