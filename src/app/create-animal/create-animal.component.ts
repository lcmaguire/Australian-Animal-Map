import { Component, OnInit } from '@angular/core';
import { doc, collection, setDoc, getFirestore, getDoc, addDoc, getDocs, serverTimestamp, Timestamp } from "firebase/firestore";
import { geohashQuery, geohashForLocation, geohashQueryBounds } from 'geofire-common'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { AuthService } from '../auth.service';
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

  sighting = { description: "", lat: -30.1, lng: 133, hash: "", type: "", timestamp: serverTimestamp(), storageReference: "", userID: "" }
  selectedFile: any;

  success = false
  errorMessage = ""

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.getTypes();
  }

  async submit() {
    this.errorMessage = this.validate()
    if (this.errorMessage == "") {
      this.sighting.storageReference = `sightings/${this.auth.user.uid}/${this.selectedFile.name}`;
      const storageRef = ref(this.storage, this.sighting.storageReference);
      uploadBytes(storageRef, this.selectedFile).then((snapshot) => {
        this.addDoc()
      });
    }
  }

  // validates request
  validate(): string {
    if (this.sighting.type == "" || this.sighting.type == "Select Animal") {
      // thow err
      return "Select Animal Type"
    }

    if (this.selectedFile == undefined || (this.selectedFile.type !== "image/png" && this.selectedFile.type !== "image/jpeg")) {
      console.log(this.selectedFile.type)
      return "Upload Image of Animal Sighting"
    }

    if (this.sighting.lat > -10 || this.sighting.lat < -45 || this.sighting.lng > 155 || this.sighting.lng < 109) {
      return "Select A location from within Australia"
    }

    return ""
  }

  async addDoc() {
    this.sighting.hash = geohashForLocation([this.sighting.lat, this.sighting.lng]);
    this.sighting.userID = this.auth.user.uid

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
      console.log(event.latLng?.toJSON())
    }
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile)
  }
}
