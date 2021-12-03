import { Injectable } from '@angular/core';

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  OAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
//import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import { user } from 'rxfire/auth';
import { tap, switchMap } from 'rxjs/operators';
// import { docData } from 'rxfire/firestore';
import { of, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = getAuth();
  firestore = getFirestore();

  user: any;
  loggedIn = false

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user
        this.user = {displayName: "It works"}
        this.loggedIn = true
      } else {
        this.loggedIn = false;
        console.log("not logged in")
      }
    });
  }

  async googleLogin() {
    const credential = signInWithPopup(this.auth, new GoogleAuthProvider());
    return this.loginHandler(credential);
  }

  signOut() {
    signOut(this.auth);
  }

  async loginHandler(promise: any) {
    let res, serverError;
    try {
      res = await promise;
    } catch (err: any) {
      serverError = err.message;
      console.error(err);
    }

    return { res, serverError };
  }

}
