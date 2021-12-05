import { Component, OnInit } from '@angular/core';
import { collection, getDocs, getFirestore } from "firebase/firestore";

@Component({
  selector: 'app-list-types',
  templateUrl: './list-types.component.html',
  styleUrls: ['./list-types.component.css']
})
export class ListTypesComponent implements OnInit {

  firestore = getFirestore();
  // types are the array of animal types supported by the site
  types: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getTypes();
  }

  async getTypes() {
    const querySnapshot = await getDocs(collection(this.firestore, "types"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      let type = doc.data();
      type.id = doc.id;
      this.types.push(type)
    });
  }
}
