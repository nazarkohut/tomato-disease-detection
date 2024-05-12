import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiseaseInfoPage } from './disease-info.page';

describe('DiseaseInfoPage', () => {
  let component: DiseaseInfoPage;
  let fixture: ComponentFixture<DiseaseInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DiseaseInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
