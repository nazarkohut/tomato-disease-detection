import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryDayPage } from './history-day.page';

describe('HistoryDayPage', () => {
  let component: HistoryDayPage;
  let fixture: ComponentFixture<HistoryDayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HistoryDayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
