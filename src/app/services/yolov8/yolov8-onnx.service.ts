import {Injectable} from '@angular/core';
import * as ort from 'onnxruntime-web';
import {onnxExecutionProvider, onnxWasmURL, YOLOConfig} from "../../utils/constants";


@Injectable({
  providedIn: 'root'
})
export class Yolov8OnnxService {
  public confidence: number = 0.3;
  public yoloClasses: string[] | [] = YOLOConfig.classes;
  private weightsURL = YOLOConfig.weightsURL;

  /**
   * Function used to pass provided input tensor to YOLOv8 neural network and return result
   * @param input Input pixels array
   * @param imageWidth
   * @param imageHeight
   * @returns Raw output of neural network as a flat array of numbers
   */
  async run_model(input: number[], imageWidth: number, imageHeight: number): Promise<object> {
    ort.env.wasm.wasmPaths = onnxWasmURL;
    console.log("Session initialization...");
    console.log("Model loading...");

    const model = await ort.InferenceSession.create(this.weightsURL, {executionProviders: [onnxExecutionProvider]});
    console.log("Tensor creation...");
    const inputTensor = new ort.Tensor(Float32Array.from(input), [1, 3, imageWidth, imageHeight]);
    console.log("Forward pass...");
    const outputs = await model.run({images: inputTensor});
    console.log("Access data...");
    return outputs["output0"].data;
  }

  /**
   * Function used to convert RAW output from YOLOv8 to an array of detected objects.
   * Each object contains the bounding box of this object, the type of object, and the probability
   * @param output Raw output of YOLOv8 network
   * @param imageWidth
   * @param imageHeight
   * @returns Array of detected objects in a format [[x1, y1, x2, y2, object_type, probability],..]
   */
  process_output(output: any, imageWidth: number, imageHeight: number): number[][] {
    let boxes: any[][] = [];
    for (let index = 0; index < 8400; index++) {
      const [class_id, prob] = [...Array(80).keys()]
        .map(col => [col, output[8400 * (col + 4) + index]])
        .reduce((accum, item) => item[1] > accum[1] ? item : accum, [0, 0]);
      if (prob < this.confidence) {
        continue;
      }
      const label = this.yoloClasses[class_id];
      const xc = output[index];
      const yc = output[8400 + index];
      const w = output[2 * 8400 + index];
      const h = output[3 * 8400 + index];
      const x1 = (xc - w / 2) / 640 * imageWidth;
      const y1 = (yc - h / 2) / 640 * imageHeight;
      const x2 = (xc + w / 2) / 640 * imageWidth;
      const y2 = (yc + h / 2) / 640 * imageHeight;
      boxes.push([x1, y1, x2, y2, label, prob]);
    }

    boxes = boxes.sort((box1, box2) => box2[5] - box1[5]);
    const result: number[][] = [];
    while (boxes.length > 0) {
      result.push(boxes[0]);
      boxes = boxes.filter(box => this.iou(boxes[0], box) < 0.7);
    }
    return result;
  }

  constructor() {
  }

  /**
   * Function calculates "Intersection-over-union" coefficient for specified two boxes
   * @param box1 First box in format: [x1, y1, x2, y2, object_class, probability]
   * @param box2 Second box in format: [x1, y1, x2, y2, object_class, probability]
   * @returns Intersection over union ratio as a float number
   */
  iou(box1: number[], box2: number[]): number {
    return this.intersection(box1, box2) / this.union(box1, box2);
  }

  /**
   * Function calculates union area of two boxes.
   * @param box1 First box in format [x1, y1, x2, y2, object_class, probability]
   * @param box2 Second box in format [x1, y1, x2, y2, object_class, probability]
   * @returns Area of the boxes union as a float number
   */
  union(box1: number[], box2: number[]): number {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const box1_area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1);
    const box2_area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1);
    return box1_area + box2_area - this.intersection(box1, box2);
  }

  /**
   * Function calculates intersection area of two boxes
   * @param box1 First box in format [x1, y1, x2, y2, object_class, probability]
   * @param box2 Second box in format [x1, y1, x2, y2, object_class, probability]
   * @returns Area of intersection of the boxes as a float number
   */
  intersection(box1: number[], box2: number[]): number {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const x1 = Math.max(box1_x1, box2_x1);
    const y1 = Math.max(box1_y1, box2_y1);
    const x2 = Math.min(box1_x2, box2_x2);
    const y2 = Math.min(box1_y2, box2_y2);
    return (x2 - x1) * (y2 - y1);
  }
}
