/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GameComponent } from './game.component';
import { GameService } from '../../services/game.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let mockGameService: jasmine.SpyObj<GameService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockGameService = jasmine.createSpyObj('GameService', [
      'getGames',
      'deleteGame',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAdmin']);

    await TestBed.configureTestingModule({
      imports: [
        GameComponent,
        RouterTestingModule,
      ],
      providers: [
        { provide: GameService, useValue: mockGameService },
        {
          provide: MessageService,
          useValue: { add: jasmine.createSpy('add') },
        },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar juegos en ngOnInit', () => {
    const mockGames = [
      {
        id: 1,
        name: 'CS:GO',
        description: 'Shooter',
        gameType: 1,
        competitions: [],
        imageUrl: '',
      },
    ];
    mockGameService.getGames.and.returnValue(of(mockGames));
    mockAuthService.isAdmin.and.returnValue(true);

    fixture.detectChanges(); // llama ngOnInit

    expect(component.gameList.length).toBe(1);
    expect(component.isAdmin).toBeTrue();
  });
});
