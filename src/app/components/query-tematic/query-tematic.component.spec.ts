import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTematicComponent } from './query-tematic.component';

describe('QueryTematicComponent', () => {
  let component: QueryTematicComponent;
  let fixture: ComponentFixture<QueryTematicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryTematicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryTematicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
