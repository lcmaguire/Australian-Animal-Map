import { Component, OnInit } from '@angular/core';
import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

@Component({
  selector: 'app-create-type',
  templateUrl: './create-type.component.html',
  styleUrls: ['./create-type.component.css']
})
export class CreateTypeComponent implements OnInit {

  firestore = getFirestore();
  storage = getStorage()
  animal = { name: "", description: "", conservationStatus: "", emoji: "", storageReference: "" }
  selectedFile: any;

  success = false
  errorMessage = ""

  conservationStatus = ["Least Concern", "Conservation Dependant", "Near Threatened", "Vulnerable", "Endangered" , "Critically Endangered", "Extinct in the Wild", "Extinct"] // Todo move to obj with string + code eg; Vulnerable (VU)
  constructor() { }

  ngOnInit(): void {
  }

  async submit() {
    const storageRef = ref(this.storage, `animal/${this.selectedFile.name}`);
    this.animal.storageReference = `animal/${this.selectedFile.name}`;
    uploadBytes(storageRef, this.selectedFile).then(async (snapshot) => {
      let res = await addDoc(collection(this.firestore, "types"),
        this.animal
      )
      if (res.id != undefined) {
        this.success = true
      }
    });
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  selectFile(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile)
  }
}
