import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPersonalComponent } from './dialog-personal.component';

describe('DialogPersonalComponent', () => {
  let component: DialogPersonalComponent;
  let fixture: ComponentFixture<DialogPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
