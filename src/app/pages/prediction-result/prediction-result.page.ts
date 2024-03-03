import {Component, OnInit} from '@angular/core';
import {PhotoService} from "../../services/photo/photo.service";
import {cameraImageConfig} from "../../utils/constants";
import {Yolov8OnnxService} from "../../services/yolov8/yolov8-onnx.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoaderService} from "../../services/loader/loader.service";
import {DatabaseService} from "../../services/database/database.service";
import {DatesService} from "../../services/dates/dates.service";
import {ConvertersService} from "../../services/converters/converters.service";
import {ActionSheetController} from "@ionic/angular";
import {HeaderService} from "../../services/header/header.service";


@Component({
  selector: 'app-prediction-result',
  templateUrl: './prediction-result.page.html',
  styleUrls: ['./prediction-result.page.scss'],
})
export class PredictionResultPage implements OnInit{

  ngOnInit(){
    this.activatedRoute.data.subscribe((val) => {
      this.presentActionSheet();
    })
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: this.actionSheetButtons
    });

    await actionSheet.present();
  }

  public actionSheetButtons = [
    {
      text: 'Take a picture',
      icon: "camera",
      handler: () => {
        this.runInferenceOnCameraPhoto("camera");
      }
    },
    {
      text: 'Upload from file system',
      icon: "folder-open-outline",
      handler: () => {
        this.runInferenceOnCameraPhoto("filesystem");
      }
    },
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.router.navigate(['history']);
      }
    },
  ];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public datesService: DatesService,
              public convertersService: ConvertersService,
              public photoService: PhotoService,
              public YOLOv8Service: Yolov8OnnxService,
              private loaderService: LoaderService,
              private databaseService: DatabaseService,
              private actionSheetCtrl: ActionSheetController,
              private headerService: HeaderService) {
  }

  goToPage(page_url: string, id: string): void {
    this.router.navigate([`${page_url}/${id}`]);
  }


  async runInferenceOnCameraPhoto(getPhotoFrom: string = "camera") {
    console.log("Executing: runInferenceOnCameraPhoto");
    const imageHeight = cameraImageConfig["imageHeight"];
    const imageWidth = cameraImageConfig["imageWidth"];
    const quality = cameraImageConfig["quality"];

    let capturedPhoto;
    if (getPhotoFrom === "camera") {
      capturedPhoto = await this.photoService.getPhotoFromCamera(quality, imageWidth, imageHeight);
    } else {
      capturedPhoto = await this.photoService.getPhotoFromFileSystem(quality, imageWidth, imageHeight);
    }

    try {
      // Show spinner before making the API call or any time-consuming task
      await this.loaderService.showLoader();
      console.log(capturedPhoto.base64String);
      console.log("DataUrl:", capturedPhoto.dataUrl);
      console.log(capturedPhoto.path);
      console.log(capturedPhoto.webPath);
      console.log(capturedPhoto.exif);

      const imageBase64 = await this.convertersService.downloadImageAsBase64(capturedPhoto.webPath!);

      const capturedPhotoNumberArray = await this.convertersService.convertImgToNumberArray(imageBase64, imageWidth, imageHeight);
      console.log("capturedPhotoNumberArray:", capturedPhotoNumberArray);
      // console.log(capturedPhotoNumberArray);
      const inferencePhoto = await this.YOLOv8Service.run_model(capturedPhotoNumberArray, imageWidth, imageHeight);
      console.log(inferencePhoto)

      const output = this.YOLOv8Service.process_output(inferencePhoto, imageWidth, imageHeight);
      console.log(output);

      // Draw bounding boxes on the image
      console.log("Going into createVisualizedImage...");

      const visualizedBase64 = await this.photoService.createVisualizedImage(imageBase64, output, imageWidth, imageHeight);

      const predictedDiseasesCounts = this.convertersService.countLabels(output);
      const fileDiseaseNames = this.convertersService.createCountString(predictedDiseasesCounts) || "NoTomatoLeavesFound"; // TODO: handle better
      const titleDiseaseNames = this.convertersService.createCountString(predictedDiseasesCounts, false, " ", " ") || "No Tomato Leaves Found";
      const currentTime = this.datesService.getCurrentTime();
      const humanFormatCurrentTime = this.datesService.formatTime(currentTime, "human_readable");
      const fileFormatCurrentTime = this.datesService.formatTime(currentTime, "fileName");
      const predictionTime = this.datesService.dateToTimestamp(currentTime);
      console.log("diseaseNames: ", fileDiseaseNames);

      const savedPhotoFile = await this.photoService.savePhoto(visualizedBase64, fileDiseaseNames, fileFormatCurrentTime, humanFormatCurrentTime);

      const prediction = {
        "webViewPath": savedPhotoFile.webviewPath,
        "fileName": titleDiseaseNames,
        "predictionTime": predictionTime,
      }
      const insertedRecordId = await this.databaseService.insertPrediction(prediction);


      this.goToPage("particular-prediction-result", insertedRecordId);
      // this.goToPage("particular-prediction-result", savedPhotoFile.webviewPath, titleDiseaseNames, humanFormatCurrentTime);
    } finally {
      // Hide the spinner regardless of success or failure
      await this.loaderService.hideLoader();
    }
  }
}
