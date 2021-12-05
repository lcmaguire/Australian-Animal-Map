import { Component, OnInit } from '@angular/core';
import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore";

@Component({
  selector: 'app-create-type',
  templateUrl: './create-type.component.html',
  styleUrls: ['./create-type.component.css']
})
export class CreateTypeComponent implements OnInit {

  firestore = getFirestore();
  animal = { name: "", description: "", emoji: "" }
  success = false
  errorMessage = ""

  constructor() { }

  ngOnInit(): void {
  }


  async submit() {
    let res = await addDoc(collection(this.firestore, "types"),
      this.animal
    )
    if (res.id != undefined) {
      this.success = true
    }
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

}
