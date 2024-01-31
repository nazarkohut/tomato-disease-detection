import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';

import {Directory, Filesystem} from '@capacitor/filesystem';
import {Preferences} from '@capacitor/preferences';
import {Capacitor} from "@capacitor/core";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';

  constructor() {
  }

  private async readAsBase64(photo: Photo) {
    const file = await Filesystem.readFile({
      path: photo.path!
    });
    return file.data;
  }

  private async savePicture(photo: Photo, fileName: string) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents
    });


    // Display the new image by rewriting the 'file://' path to HTTP
    // Details: https://ionicframework.com/docs/building/webview#file-protocol
    return {
      filepath: savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
    };
  }

  // getCurrentDateTime(): string  { // TODO: move
  //   const timestamp = Date.now();
  //   const options: Intl.DateTimeFormatOptions = {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //     hour: 'numeric',
  //     minute: 'numeric',
  //     second: 'numeric',
  //     hour12: false, // Use 24-hour format
  //   };
  //   return new Date(timestamp).toLocaleString('en-US', options);
  // }

  generateFileName(diseaseName: string = 'LateBlight'): string { // TODO: remove default parameter
    const date = new Date();

    // Format the date components separately
    const year = date.getFullYear(); // TODO: consider moving all of this somewhere
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Combine components to form the file name
    return `${diseaseName}_${year}${month}${day}_${hours}${minutes}${seconds}.jpeg`;
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto, "Late_Blight_" + this.generateFileName() + ".jpeg");

    this.photos.unshift(savedImageFile);

    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
    return capturedPhoto;
  }

  public async loadSaved() {
    // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];
  }
}

