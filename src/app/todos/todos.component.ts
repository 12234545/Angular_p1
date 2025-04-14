import { Component, inject, OnInit, signal } from '@angular/core';
import { TodosService } from '../services/todos.service';
import { todo } from '../model/todo.type';
import { catchError } from 'rxjs';
import { TodoItemComponent } from '../components/todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
import { FilterTodosPipe } from '../pipes/filter-todos.pipe';


@Component({
  selector: 'app-todos',
  imports: [TodoItemComponent , FormsModule , FilterTodosPipe],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {
  todoService = inject(TodosService);
  todoItems = signal<Array<todo>>([]);
  searchTerm = signal('');
  ngOnInit(): void {

    this.todoService.getTodosFromApi().pipe(catchError(err => {
      console.log(err);
      throw err;
    })).subscribe((todos) =>{
      this.todoItems.set(todos);
    });
  }

  UpdateTodoItem(todoItems: todo) {
        this.todoItems.update((todos) => {
               return todos.map((todo) => {
                  if (todo.id === todoItems.id) {
                    return { ...todo, completed: !todo.completed };
                  }
                  return todo;
               });
        });
  }
}
