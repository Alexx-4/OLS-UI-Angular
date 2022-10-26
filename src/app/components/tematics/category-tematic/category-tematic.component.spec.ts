import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTematicComponent } from './category-tematic.component';

describe('CategoryTematicComponent', () => {
  let component: CategoryTematicComponent;
  let fixture: ComponentFixture<CategoryTematicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryTematicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryTematicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
