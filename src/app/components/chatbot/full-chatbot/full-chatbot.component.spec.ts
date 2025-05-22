import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullChatbotComponent } from './full-chatbot.component';

describe('FullChatbotComponent', () => {
  let component: FullChatbotComponent;
  let fixture: ComponentFixture<FullChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullChatbotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
