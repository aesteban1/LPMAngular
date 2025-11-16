import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loadingcontent } from './loadingcontent';

describe('Loadingcontent', () => {
  let component: Loadingcontent;
  let fixture: ComponentFixture<Loadingcontent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loadingcontent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loadingcontent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
