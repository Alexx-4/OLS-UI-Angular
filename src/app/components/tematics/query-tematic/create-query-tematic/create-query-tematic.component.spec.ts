import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQueryTematicComponent } from './create-query-tematic.component';

describe('CreateQueryTematicComponent', () => {
  let component: CreateQueryTematicComponent;
  let fixture: ComponentFixture<CreateQueryTematicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateQueryTematicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQueryTematicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
