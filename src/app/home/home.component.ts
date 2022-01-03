import { Component, OnInit } from '@angular/core';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  firestore = getFirestore();
  storage = getStorage();
  // types are the array of animal types supported by the site
  types: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getTypes();
  }

  async getTypes() {
    const querySnapshot = await getDocs(collection(this.firestore, "types"));
    querySnapshot.forEach(async (doc) => {
      let t = { id: doc.id, ...doc.data(), imgURL: await this.getURL(doc.data().storageReference)}
      this.types.push(t)
    });
  }

  async getURL(path: string) :Promise<string> {
    const pathReference = ref(this.storage, path);
    return getDownloadURL(pathReference)
      .then((url) => {
        return url
      });
  }

}
