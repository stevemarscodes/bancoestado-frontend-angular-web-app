import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLandingComponent } from './header-landing.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { CapsuleComponent } from '../capsule/capsule.component';
import { Button2Component } from '../button/button2/button2.component';
import { ButtonComponent } from '../components-atom/button/button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from '../components.module';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HeaderLandingComponent', () => {
  let component: HeaderLandingComponent;
  let fixture: ComponentFixture<HeaderLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        HeaderLandingComponent,
        MobileMenuComponent,
        TopBarComponent


      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
        
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
