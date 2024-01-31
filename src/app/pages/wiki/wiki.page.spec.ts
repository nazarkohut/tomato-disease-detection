import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WikiPage } from './wiki.page';

describe('WikiPage', () => {
  let component: WikiPage;
  let fixture: ComponentFixture<WikiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WikiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
