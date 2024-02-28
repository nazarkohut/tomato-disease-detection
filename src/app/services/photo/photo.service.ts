import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';

import {Directory, Filesystem} from '@capacitor/filesystem';
import {Capacitor} from "@capacitor/core";
import {StorageService} from "../storage/storage.service";
import {ConvertersService} from "../converters/converters.service";
import {DatabasePrediction, DatabaseService} from "../database/database.service";
import {DatesService} from "../dates/dates.service";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {


  // public photos: Prediction[] = []; // TODO: set type
  public days: any = [];
  public photosByDay: DatabasePrediction[] = []; // TODO: perhaps change this logic

  private PHOTO_STORAGE: string = 'predicted-diseases-photos';

  constructor(private storageService: StorageService,
              private databaseService: DatabaseService,
              public convertersService: ConvertersService,
              private datesService: DatesService) {
  }

  private async readAsBase64(photo: Photo) {
    const file = await Filesystem.readFile({
      path: photo.path!
    });
    return file.data;
  }

  private async savePicture(photo: Photo | string, fileName: string, predictionTime: string, predictionTimeReadable: string) {
    // Convert photo to base64 format, required by Filesystem API to save
    let base64Data;
    if (typeof photo !== 'string'){
      base64Data = await this.readAsBase64(photo);
    } else {
      base64Data = photo
    }

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
      fileName: fileName,
      predictionTime: predictionTime,
      predictionTimeReadable: predictionTimeReadable,
    };
  }

  public async getPhotoFromCamera(quality: number, width: number, height: number) {
    return await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: quality,
      width: width,
      height: height
    });
  }

  public async getPhotoFromFileSystem(quality: number, width: number, height: number) {
    return await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: quality,
      width: width,
      height: height
    });
  }

  public async savePhoto(inferencePhoto: string | Photo, diseaseNames: string, predictionTime: string, predictionTimeReadable: string){
    const savedImageFile = await this.savePicture(inferencePhoto, `${this.convertersService.generateFileName(diseaseNames, predictionTime)}.jpeg`, predictionTime, predictionTimeReadable);

    // this.photos.unshift(savedImageFile);

    // this.storage.set(this.PHOTO_STORAGE, JSON.stringify(this.photos)); // TODO: do we need this one?
    return savedImageFile;
  }

  // public async loadSaved() {
  //   this.photos = this.database.getPredictions();
  //   // console.log("PHOTOS from loadSaved in PHOTOSERVICE: ", this.photos)
  //   // const value = await this.storage.get(this.PHOTO_STORAGE);
  //   // this.photos = value ? JSON.parse(value) : [];
  //   // console.dir("this.photos: ", this.photos);
  // }

  public async loadSavedPredictionsDays() {
    await this.databaseService.loadPredictionsDays();

    const uniqueDaysSet: Set<string> = new Set(); // Create a Set to store unique days as strings

    this.databaseService.getPredictionsDays().forEach((val: any) => {
      const datetimeTuple = this.datesService.timestampToDate(val.predictionTime);
      const dateTuple = datetimeTuple.slice(0, 3);
      console.log("Date Tuple: ", dateTuple)
      const dateString = JSON.stringify(dateTuple); // Serialize tuple into a string
      uniqueDaysSet.add(dateString);
    });

    // Convert the Set back to an array of tuples
    this.days = Array.from(uniqueDaysSet).map((dateString: string) => JSON.parse(dateString));

    console.log("These days: ", this.days);

  }

  async loadPredictionByDay(year: string, month: string, day: string){
    await this.databaseService.loadPredictionsByDay(year, month, day);

    this.photosByDay = this.databaseService.getPredictionsByDays();
    console.log("These photos by day: ", this.photosByDay)
  }


  async createVisualizedImage(base64Image: string, boundingBoxes: number[][], imageWidth: number, imageHeight: number): Promise<string> {
    console.log("Init canvas...");
    const canvas = document.createElement('canvas');
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    console.log("Init context...");
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    console.log("Before promise");
    // Draw the base image
    const image = new Image();
    image.src = base64Image;
    await new Promise<void>(resolve => {
      image.onload = () => {
        ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
        // ctx.fillStyle = '#ce0000';

        // Draw bounding boxes and labels
        ctx.lineWidth = 2;
        ctx.font = '16px Arial';
        for (const box of boundingBoxes) {
          const [x1, y1, x2, y2, diseaseName, confidenceLevel] = box;

          ctx.beginPath();
          ctx.rect(x1, y1, x2 - x1, y2 - y1);
          ctx.stroke();

          // Draw red background
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(x1, y1 - 20, ctx.measureText(`${diseaseName}: ${confidenceLevel.toFixed(2)}`).width, 20);

          // Draw white text
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${diseaseName}: ${confidenceLevel.toFixed(2)}`, x1, y1 - 5);
        }

        resolve();
      };
    });
    console.log("After promise");

    // Convert canvas to base64 data URL
    const visualizedBase64 = canvas.toDataURL('image/jpeg');
    console.log("2 - visualizedBase64: ", visualizedBase64);
    return visualizedBase64;
  }
}


