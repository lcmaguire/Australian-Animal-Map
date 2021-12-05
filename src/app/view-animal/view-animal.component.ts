import { Component, OnInit, Input } from '@angular/core';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { doc, getDoc, getFirestore } from "firebase/firestore";

@Component({
  selector: 'app-view-animal',
  templateUrl: './view-animal.component.html',
  styleUrls: ['./view-animal.component.css']
})
export class ViewAnimalComponent implements OnInit {
  @Input() model: any;   // instead of any, specify your type
  firestore = getFirestore();
  constructor(private route: ActivatedRoute) {
  }

  storage = getStorage();
  imgURL = "" // promise of string 
  center = { lat: -30, lng: 133.3 }; // move this to not be hardcoded
  zoom = 9
  markerPosition ={ draggable: false, position: this.center };
  options: google.maps.MapOptions = {
    streetViewControl: false
  };

  ngOnInit(): void {
    if (this.model == undefined || this.model.id == "") {
      const routeParams = this.route.snapshot.paramMap;
      const idFromRoute = String(routeParams.get('id'));
      this.getAnimal(idFromRoute);
    } else {
      this.getURL();
    }
    console.log(this.model)
    //this.getURL();
  }

  // not a great design but just want it to work for now
  getURL() {
    const pathReference = ref(this.storage, `${this.model?.id}.png`);
    return getDownloadURL(pathReference)
      .then((url) => {
        console.log(url)
        this.imgURL = url;
        return url
      });
  }

  async getAnimal(id: string) {
    const docRef = doc(this.firestore, "cities", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      let obj = docSnap.data();
      obj.id = docSnap.id;
      this.model = obj;
      this.getURL()
    } else {
      // err handle + redirect
    }
  }
}
