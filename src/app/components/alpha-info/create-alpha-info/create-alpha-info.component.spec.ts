import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAlphaInfoComponent } from './create-alpha-info.component';

describe('CreateAlphaInfoComponent', () => {
  let component: CreateAlphaInfoComponent;
  let fixture: ComponentFixture<CreateAlphaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAlphaInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAlphaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
