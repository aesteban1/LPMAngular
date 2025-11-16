import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gridcard } from './gridcard';

describe('Gridcard', () => {
  let component: Gridcard;
  let fixture: ComponentFixture<Gridcard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gridcard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gridcard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
