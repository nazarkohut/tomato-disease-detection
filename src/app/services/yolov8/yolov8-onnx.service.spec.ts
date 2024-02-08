import { TestBed } from '@angular/core/testing';

import { Yolov8OnnxService } from './yolov8-onnx.service';

describe('Yolov8OnnxService', () => {
  let service: Yolov8OnnxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Yolov8OnnxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
