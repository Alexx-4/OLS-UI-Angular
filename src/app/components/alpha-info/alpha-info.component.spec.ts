import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaInfoComponent } from './alpha-info.component';

describe('AlphaInfoComponent', () => {
  let component: AlphaInfoComponent;
  let fixture: ComponentFixture<AlphaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphaInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
