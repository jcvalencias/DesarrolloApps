// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'http://192.168.43.81:3000',
  firebaseConfig : {
    apiKey: "AIzaSyC-TiU362H9O61s6Dd59l97vhE15-Q6aOw",
    authDomain: "ronda-semanal.firebaseapp.com",
    projectId: "ronda-semanal",
    storageBucket: "ronda-semanal.appspot.com",
    messagingSenderId: "531521260136",
    appId: "1:531521260136:web:b5cd950e3c51f815b889dd",
    measurementId: "G-BQ8NC9VFNZ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
