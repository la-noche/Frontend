import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTypeFormComponent } from './game-type-form.component';

describe('GameTypeFormComponent', () => {
  let component: GameTypeFormComponent;
  let fixture: ComponentFixture<GameTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
