import { Directive, input , effect, inject, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlightCompletedTodo]'
})
export class HighlightCompletedTodoDirective {
   iscompleted = input(false);
  el = inject(ElementRef);

  StyleEffecr = effect(()=>{
    if (this.iscompleted()) {
      this.el.nativeElement.style.backgroundColor = '#C7BDB9';
      this.el.nativeElement.style.textDecoration = 'line-through';
    } else {

    }

  })
}
