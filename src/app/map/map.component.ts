import { Component, OnInit, ViewChild } from '@angular/core';
import { doc, collection, setDoc, getFirestore, getDoc, addDoc, getDocs, Timestamp } from "firebase/firestore";

import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { geohashQuery, geohashForLocation, geohashQueryBounds } from 'geofire-common'

import { query, orderBy, limit, where, startAt, endAt, QueryConstraint } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  firestore = getFirestore();
  storage = getStorage();

  options: google.maps.MapOptions = {
    center: { lat: -30, lng: 133.3 },
    zoom: 4,
    streetViewControl: false
  };
  markerOptions: google.maps.MarkerOptions[] = []

  sampleModel: any;

  // types are the array of animal types supported by the site
  types: string[] = [];

  // user selected type
  type = ""

  // objects of animal sightings.
  sightings: any[] = []

  constructor() {
  }

  ngOnInit(): void {
    this.getTypes();
  }

  async getSightings() {
    this.markerOptions = []
    this.handleQuery(...this.buildQuery())
  }

  async getTypes() {
    const querySnapshot = await getDocs(collection(this.firestore, "types"));
    querySnapshot.forEach((doc) => {
      let type = doc.data();
      this.types.push(type.name)
      this.type = this.types[0] // hardcode for now
      this.getSightings();
    });
  }

  openInfoWindow(marker: MapMarker, info: any) {
    if (this.infoWindow != undefined) {
      this.sampleModel = this.sightings.find(element => element.id == info) // info is set to the doc id of the selected sighting.
      this.infoWindow
      this.infoWindow.open(marker);
    }
  }

  // will close the info window when open and clicked outside of the info window.
  closeInfoWindow(event: google.maps.MapMouseEvent) {
    this.infoWindow?.close()
  }

  mapDragend(a: GoogleMap) {
    this.options.center = a.getCenter()?.toJSON()
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  // todo set up more complex queries via this.
  search() {
    this.getSightings()
  }

  buildQuery(): QueryConstraint[] { // rename buildQuery
    // based upon query make arr and return
    let queries: QueryConstraint[] = [];
    if (this.type != "") {
      queries.push(where("type", "==", this.type))
    }
    queries.push(orderBy("timestamp", "desc"))
    return queries
  }

  async handleQuery(...queries: QueryConstraint[]) {
    const citiesRef = collection(this.firestore, "sightings")
    const q = query(citiesRef, ...queries);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let markO = { draggable: false, position: { lat: doc.data().lat, lng: doc.data().lng, }, title: doc.id };
      this.markerOptions.push(markO)
      let sighting = doc.data()
      sighting.id = doc.id

      this.sampleModel = sighting // init so that it doesn't throw undefined err.
      this.sightings.push(sighting)
    });
  }
}
