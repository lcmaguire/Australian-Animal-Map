import { Component, OnInit } from '@angular/core';
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  firestore = getFirestore();

  constructor() { }

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

}
