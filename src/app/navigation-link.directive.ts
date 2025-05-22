import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNavigationLink]',
  standalone: true
})
export class NavigationLinkDirective {

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    // On s'assure que l'événement de clic ne se propage pas plus loin
    event.stopPropagation();
  }
}
