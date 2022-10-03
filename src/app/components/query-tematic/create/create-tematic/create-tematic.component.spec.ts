import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTematicComponent } from './create-tematic.component';

describe('CreateTematicComponent', () => {
  let component: CreateTematicComponent;
  let fixture: ComponentFixture<CreateTematicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTematicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTematicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
