import { Component} from '@angular/core';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-header',
  imports: [RouterLink ],
  template: `
  <header>
    <nav>
       <span routerLink="/"> {{title}} </span>
        <ul>
          <li routerLink="/todos">Todos</li>
        </ul>
    </nav>
  </header>
  `,
  styleUrl: `./header.component.scss`,

})
export class HeaderComponent {
  title = 'My First Angular App';
}
