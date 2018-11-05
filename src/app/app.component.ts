import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { firebaseConfig } from './credentials';

import { MoviesPage } from '../pages/movies/movies';
import { LoginPage } from '../pages/login/login';
import { Unsubscribe } from '@firebase/util';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private faio: FingerprintAIO) {
    firebase.initializeApp(firebaseConfig);
    const unsubscribe: Unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.fingerprintAvailable();
        //this.rootPage = MoviesPage;
        unsubscribe();
      } else {
        this.rootPage = LoginPage;
        unsubscribe();
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  fingerprintAvailable() {
    this.faio.show({
      clientId: 'Você pode usar sua digital para acessar a conta. Para isso, toque no sensor.',
      clientSecret: 'password'
    })
    .then(result => {
      this.rootPage = MoviesPage;
    })
    .catch(error => {
      console.log('Error: ', error);
    })
  }
}