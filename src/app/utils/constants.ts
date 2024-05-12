/**
 * Config with constant and descriptive variables of model used
 */
export const YOLOConfig = {
  version: 8,
  classes: [
    'Early Blight',
    'Healthy',
    'Late Blight',
    'Leaf Miner',
    'Leaf Mold',
    'Mosaic Virus',
    'Septoria',
    'Spider Mites',
    'Yellow Leaf Curl Virus'
  ],
  // weightsURL: "/assets/models/best_opset12.onnx",
  // weightsURL: "/assets/models/best_nano_opset18.onnx",
  weightsURL: "/assets/models/yolov8n_opset18_noimgsz.onnx",
  // weightsURL: "/assets/models/best_opset18.onnx", // did not change anything(predictions same as on opset12)
}

export const onnxExecutionProvider: string = 'wasm';
export const onnxWasmURL: string = "/assets/"

/**
 * Parameters used when taking photo using Camera
 */
export const cameraImageConfig = {
  "imageHeight": 640,
  "imageWidth": 640,
  "quality": 100
}

export const databaseConfig = {
  "prediction-table-name": "Prediction"
}
