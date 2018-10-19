import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  audio = new Audio();
  volSlider: Object = {
    'min': 0,
    'max': 1,
    'value': 0.5,
    'step': 0.01
  };

  constructor(
    private afStorage: AngularFireStorage
  ) { }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  playSound(text: string) {
    const re = /^orga[0-9]*$/;

    if (re.test(text)) {
      // Create a reference to the file we want to download
      const itemRef = this.afStorage.storage.ref('orga/' + text + '.ogg');

      // Get the download URL
      itemRef.getDownloadURL().then((url) => {
        this.audio.pause();
        this.audio.currentTime = 0;
        const volume = this.volSlider['value']; // Number(this.volumeElement.value) !== NaN ? Number(this.volumeElement.value) : 0.5;
        this.audio.volume = volume;
        this.audio.src = url;
        this.audio.play();
      }).catch((error) => {
        this.outputError(error);
      });
    } else {
      // Create a reference to the file we want to download
      const itemRef = this.afStorage.storage.ref('sound/' + text + '.ogg');

      // Get the download URL
      itemRef.getDownloadURL().then((url) => {
        const sound = new Audio(url);
        const volume = this.volSlider['value']; // Number(this.volumeElement.value) !== NaN ? Number(this.volumeElement.value) : 0.5;
        sound.volume = volume;
        sound.play();
      }).catch((error) => {
        this.outputError(error);
      });
    }
  }

  outputError(error) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        console.log('Object not found');
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log('Permission denied');
        break;
      case 'storage/canceled':
        // User canceled the upload
        console.log('Canceled upload');
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        console.log('Unknown error');
        break;
    }
  }
}
