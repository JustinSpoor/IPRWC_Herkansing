import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if(window.scrollY > 300) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}
