import { Component, OnInit } from '@angular/core';
import { doc, collection, setDoc, getFirestore, getDoc, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { geohashQuery, geohashForLocation, geohashQueryBounds } from 'geofire-common'
import { getStorage, ref, uploadBytes } from "firebase/storage";
@Component({
  selector: 'app-create-animal',
  templateUrl: './create-animal.component.html',
  styleUrls: ['./create-animal.component.css']
})
export class CreateAnimalComponent implements OnInit {

  firestore = getFirestore();
  storage = getStorage()

  options: google.maps.MapOptions = {
    center: { lat: -30, lng: 133.3 },
    zoom: 4,
  };
  markerPosition: google.maps.MarkerOptions = { draggable: true, position: { lat: -30, lng: 133 } }

  // types are the array of animal types supported by the site
  types: string[] = [];

  sighting = { description: "", lat: -30.1, lng: 133, hash: "", type: "", timestamp: serverTimestamp(), storageReference: "" }
  selectedFile: any;

  success = false
  errorMessage = ""

  constructor() { }

  ngOnInit(): void {
    this.getTypes();
  }

  async submit() {
    console.log(this.sighting.type)
    if (this.sighting.type == "" || this.sighting.type == "Select Animal") {
      // thow err
    } else {
      if (this.selectedFile != undefined) {
        const storageRef = ref(this.storage, this.selectedFile.name);
        this.sighting.storageReference = this.selectedFile.name;
        uploadBytes(storageRef, this.selectedFile).then((snapshot) => {
          this.addDoc()
        });
      } else {
        // handle upload with no img
        // this.addDoc()
      }
    }
  }

  async addDoc() {
    this.sighting.hash = geohashForLocation([this.sighting.lat, this.sighting.lng]);
    let res = await addDoc(collection(this.firestore, "sightings"),
      this.sighting,
    )
    this.success = true
  }

  async getTypes() {
    const querySnapshot = await getDocs(collection(this.firestore, "types"));
    querySnapshot.forEach((doc) => {
      let type = doc.data();
      this.types.push(type.name)
    });
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  drag(event: google.maps.MapMouseEvent) {
    if (event.latLng?.toJSON() != undefined) {
      this.sighting.lat = event.latLng?.toJSON().lat
      this.sighting.lng = event.latLng?.toJSON().lng
    }
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files[0];
  }
}
