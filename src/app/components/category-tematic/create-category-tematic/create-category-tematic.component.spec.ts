import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryTematicComponent } from './create-category-tematic.component';

describe('CreateCategoryTematicComponent', () => {
  let component: CreateCategoryTematicComponent;
  let fixture: ComponentFixture<CreateCategoryTematicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCategoryTematicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCategoryTematicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
