import { Component, inject, input, output } from '@angular/core';
import { todo } from '../../model/todo.type';
import { HighlightCompletedTodoDirective } from '../../directives/highlight-completed-todo.directive';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  imports: [ HighlightCompletedTodoDirective , UpperCasePipe],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {

 todo = input.required<todo>();
 todoToggled = output<todo>();

 todoClicked() {
  this.todoToggled.emit(this.todo());
 }
}
