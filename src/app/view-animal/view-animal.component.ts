import { Component, OnInit, Input } from '@angular/core';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-view-animal',
  templateUrl: './view-animal.component.html',
  styleUrls: ['./view-animal.component.css']
})
export class ViewAnimalComponent implements OnInit {
  @Input() model: any;   // instead of any, specify your type
  constructor() {
  }

  storage = getStorage();
  imgURL = "" // promise of string
  ngOnInit(): void {
    if (this.model !== undefined || this.model.id !== "") {
      this.getURL();
    } 
  }

  // not a great design but just want it to work for now
  async getURL() {
    const pathReference = ref(this.storage, `${this.model?.id}.png`);
    return getDownloadURL(pathReference)
      .then((url) => {
        console.log(url)
        this.imgURL = url;
        return url
      });
  }
}
