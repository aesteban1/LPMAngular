import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyDisplay } from './empty-display';

describe('EmptyDisplay', () => {
  let component: EmptyDisplay;
  let fixture: ComponentFixture<EmptyDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
