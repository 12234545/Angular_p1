import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet ],
  template: `

   <main>
      <router-outlet></router-outlet>
   </main>
  `,
  styles: [
    `
      main {
        Padding: 16px;
      }
    `
  ],
})
export class AppComponent {
  title = 'CLICK2LEARN';
}
