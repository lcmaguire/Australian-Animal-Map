import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-view-animal',
  templateUrl: './view-animal.component.html',
  styleUrls: ['./view-animal.component.css']
})
export class ViewAnimalComponent implements OnInit, OnChanges {
  @Input() model: any;   // instead of any, specify your type visible toggle?
  constructor() {
  }

  storage = getStorage();
  imgURL = "" // promise of string
  ngOnInit(): void {
  }

  // alternate solution save imgurl with obj
  ngOnChanges(changes: SimpleChanges): void {
    if (this.model !== undefined || this.model.id !== "") {
      console.log(this.model)
      this.imgURL = ""
      if (this.model?.storageRef != "") {
        this.getURL();
      }
    }
  }

  // not a great design but just want it to work for now
  async getURL() {
    const pathReference = ref(this.storage, this.model?.storageReference);
    return getDownloadURL(pathReference)
      .then((url) => {
        console.log(url)
        this.imgURL = url;
        return url
      });
  }
}
