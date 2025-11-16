import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Columnmenu } from './columnmenu';

describe('Columnmenu', () => {
  let component: Columnmenu;
  let fixture: ComponentFixture<Columnmenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Columnmenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Columnmenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
