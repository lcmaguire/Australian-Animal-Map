import { Component, OnInit, ViewChild } from '@angular/core';
import { doc, collection, setDoc, getFirestore, getDoc, addDoc, getDocs, Timestamp } from "firebase/firestore";

import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { geohashQuery, geohashForLocation, geohashQueryBounds } from 'geofire-common'

import { query, orderBy, limit, where, startAt, endAt, QueryConstraint } from "firebase/firestore";

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
    zoom: 4,
    streetViewControl: false
  };
  markerOptions: google.maps.MarkerOptions[] = []

  sampleModel: any;

  // types are the array of animal types supported by the site
  types: string[] = [];

  // user selected type
  type = ""

  now = new Date()

  afterTimeFilters: any[] = [
    { text: "Last Month", timestamp: new Date().setMonth(this.now.getMonth() - 1) },
    { text: "This Year", timestamp: new Date().setMonth(0) }
  ]

  afterTimeFilter: any = this.afterTimeFilters[0].timestamp

  // objects of animal sightings.
  sightings: any[] = []

  constructor() {
  }

  ngOnInit(): void {
    this.getTypes();
    //this.getSightings();
  }

  async getSightings() {
    console.log(this.afterTimeFilters)

    this.markerOptions = []
    const citiesRef = collection(this.firestore, "sightings",) // shows all animals, todo add in type and arr-contains based queries + location based.
    console.log(this.type)
    if (this.type == "Koala") {
      //this.afterTimeFilter = this.now;
      //this.type = "";
      this.geoQuery(...this.queryBuilder())
      //this.handleQuery(...this.queryBuilder())
    } else {
      this.geoQuery(...this.queryBuilder())
      //this.handleQuery(...this.queryBuilder())
    }
  }

  async getTypes() {
    const querySnapshot = await getDocs(collection(this.firestore, "types"));
    querySnapshot.forEach((doc) => {
      let type = doc.data();
      this.types.push(type.name)
      this.type = this.types[0] // hardcode for now
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
    console.log(a.getCenter()?.toJSON())
    this.options.center = a.getCenter()?.toJSON()
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  // todo set up more complex queries via this.
  search() {
    this.getSightings()
  }

  queryBuilder(): QueryConstraint[] { // rename buildQuery
    // based upon query make arr and return
    let queries: QueryConstraint[] = [];
    if (this.type != "") {
      queries.push(where("type", "==", this.type))
    }
    if (this.afterTimeFilter < this.now) {
      let d = new Date(Number(this.afterTimeFilter))
      queries.push(where("timestamp", ">=", Timestamp.fromDate(d)), orderBy("timestamp"))
    }
    return queries
  }

  async geoQuery(...queries: QueryConstraint[]) {
    const center = [Number(this.options.center?.lat), Number(this.options.center?.lng)];
    console.log(center)
    const radiusInM = 5000 * 1000;
    const bounds = geohashQueryBounds(center, radiusInM);
    for (const b of bounds) {
      //queries.push(orderBy("hash"), startAt(b[0]), endAt(b[1]))
      //this.handleQuery(...queries)
      const citiesRef = collection(this.firestore, "sightings")
      //const q = query(citiesRef, ...queries);
      let d = new Date(Number(this.afterTimeFilter))
      let ts = Timestamp.fromDate(d)
      console.log(b)
      const q = query(citiesRef, where("type", "==", this.type),
        where("timestamp", ">=", Timestamp.fromDate(d)),
        orderBy("timestamp", "desc"),
        orderBy("hash",),
        startAt(Timestamp.now(), b[0]),
        endAt(ts, b[1])
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let markO = { draggable: false, position: { lat: doc.data().lat, lng: doc.data().lng, }, title: doc.id };
        this.markerOptions.push(markO)
        let sighting = doc.data()
        sighting.id = doc.id

        this.sampleModel = sighting // init so that it doesn't throw undefined err.
        this.sightings.push(sighting)
        console.log(sighting.timestamp)
      });
    }
  }

  async handleQuery(...queries: QueryConstraint[]) {
    console.log(queries)
    const citiesRef = collection(this.firestore, "sightings")
    const q = query(citiesRef, ...queries);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log("here")
      let markO = { draggable: false, position: { lat: doc.data().lat, lng: doc.data().lng, }, title: doc.id };
      this.markerOptions.push(markO)
      let sighting = doc.data()
      sighting.id = doc.id

      this.sampleModel = sighting // init so that it doesn't throw undefined err.
      this.sightings.push(sighting)
    });

    if (querySnapshot.empty) {
      console.log("empty")
    }
  }
}
