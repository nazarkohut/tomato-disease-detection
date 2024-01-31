import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PredictionResultPage } from './prediction-result.page';

describe('PredictionResultPage', () => {
  let component: PredictionResultPage;
  let fixture: ComponentFixture<PredictionResultPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PredictionResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
