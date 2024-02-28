import { Injectable } from '@angular/core';
import * as cv from "@techstark/opencv-js";

@Injectable({
  providedIn: 'root'
})
export class ConvertersService {

  constructor() { }

  public async downloadImageAsBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return this.convertBlobToBase64(blob);
  }

  public async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  generateFileName(diseaseNames: string, predictionTime: string): string {
    return `${diseaseNames}_${predictionTime}`;
  }

  public convertImgToNumberArray(imgAsBase64: string, imageWidth: number, imageHeight: number): Promise<number[]> {
    const image = new Image();
    image.src = imgAsBase64;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get context');
    }
    return new Promise((resolve) => {
      image.onload = function () {
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        context.drawImage(image, 0, 0, imageWidth, imageHeight);
        const imageData = context.getImageData(0, 0, imageWidth, imageHeight);

        // Create a Mat object from the image data
        const mat = cv.matFromImageData(imageData);

        const dst = new cv.Mat();
        cv.resize(mat, dst, new cv.Size(640, 640), 0, 0, cv.INTER_LINEAR);

        const red: number[] = [];
        const green: number[] = [];
        const blue: number[] = [];

        // Loop through each pixel in the Mat
        for (let row = 0; row < dst.rows; row++) { // TODO: redo to opencv js normalization
          for (let col = 0; col < dst.cols; col++) {
            // Get the pixel value at (row, col)
            let pixel = dst.ucharPtr(row, col);

            // Extract the Red, Green, and Blue channels
            let r = pixel[0] / 255.0;
            let g = pixel[1] / 255.0;
            let b = pixel[2] / 255.0;

            // Store the values in respective arrays
            red.push(r);
            green.push(g);
            blue.push(b);
          }
        }
        const input = [...red, ...green, ...blue];
        console.log("INPUT: ", input)
        resolve(input);
      };
    });
  }


  countLabels(predictionResult: any[][]): { [label: string]: number } {
    const counts: { [label: string]: number } = {};

    // Iterate over each sublist in the big list
    for (const sublist of predictionResult) {
      // Extract the label from each sublist
      const label = sublist[4];

      // If the label exists, increment its count in the counts array
      if (label !== undefined) {
        counts[label] = (counts[label] || 0) + 1;
      }
    }

    return counts;
  }

  createCountString(labelCounts: {
    [label: string]: number
  }, replaceWhitespaces: boolean = true, countDelimiter: string = '-', spaceDelimiter: string = '_'): string {
    const countStrings: string[] = [];

    // Iterate over each label and its count
    for (const [label, count] of Object.entries(labelCounts)) {
      if (replaceWhitespaces) {
        const cleanedLabel = label.replace(/\s/g, '');
        countStrings.push(`${count}${countDelimiter}${cleanedLabel}`);
      } else {
        countStrings.push(`${count}${countDelimiter}${label}`);
      }
    }

    // Join the count strings with underscores
    return countStrings.join(spaceDelimiter);
  }
}
