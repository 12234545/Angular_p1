import { Pipe, PipeTransform } from '@angular/core';
import { todo } from '../model/todo.type';

@Pipe({
  name: 'filterTodos'
})
export class FilterTodosPipe implements PipeTransform {

  transform(todos: todo[], searchTerm : string): todo[] {
    if(!searchTerm){
      return todos;
    }
    const text = searchTerm.toLowerCase();
    return todos.filter(todo => {
      return todo.title.toLowerCase().includes(text);
    });
  }

}
