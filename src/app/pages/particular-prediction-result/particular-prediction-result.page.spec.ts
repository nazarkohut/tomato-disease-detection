import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticularPredictionResultPage } from './particular-prediction-result.page';

describe('ParticularPredictionResultPage', () => {
  let component: ParticularPredictionResultPage;
  let fixture: ComponentFixture<ParticularPredictionResultPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParticularPredictionResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
