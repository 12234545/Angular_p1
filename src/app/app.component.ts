import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent ],
  template: `

   <main>
      <router-outlet></router-outlet>
      <app-footer></app-footer>

   </main>
  `,
  styles: [
    `
      main {
        Padding: 0px;
      }
    `
  ],
})
export class AppComponent {
  title = 'CLICK2LEARN';
}
