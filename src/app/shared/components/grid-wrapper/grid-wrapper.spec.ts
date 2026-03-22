import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridWrapper } from './grid-wrapper';

@Component({
  standalone: true,
  imports: [GridWrapper],
  template: `
    <app-grid-wrapper>
      <span class="projected-item">Card</span>
    </app-grid-wrapper>
  `
})
class TestHostComponent {}

describe('GridWrapper', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project content inside the grid container', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.grid-wrapper__grid')).not.toBeNull();
    expect(compiled.querySelector('.projected-item')?.textContent).toContain('Card');
  });
});
