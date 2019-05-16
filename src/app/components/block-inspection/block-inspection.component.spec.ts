import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockInspectionComponent } from './block-inspection.component';

describe('BlockInspectionComponent', () => {
  let component: BlockInspectionComponent;
  let fixture: ComponentFixture<BlockInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
