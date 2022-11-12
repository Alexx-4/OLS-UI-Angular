import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientAppComponent } from './create-client-app.component';

describe('CreateClientAppComponent', () => {
  let component: CreateClientAppComponent;
  let fixture: ComponentFixture<CreateClientAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateClientAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClientAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
