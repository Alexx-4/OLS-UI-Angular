import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAppComponent } from './client-app.component';

describe('ClientAppComponent', () => {
  let component: ClientAppComponent;
  let fixture: ComponentFixture<ClientAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
