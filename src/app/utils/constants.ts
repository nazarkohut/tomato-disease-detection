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
  weightsURL: "/assets/models/best_opset12.onnx",
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
