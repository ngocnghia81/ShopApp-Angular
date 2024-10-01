import {Component, Inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import { filter } from 'rxjs';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {DOCUMENT} from "@angular/common";
import {UserService} from "./services/user.service";
import {LoginDTO} from "./dtos/user/login.dto";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
  ],
  standalone: true
})
export class AppComponent implements OnInit {
  showHeaderAndFooter: boolean = true;
  title = 'shopapp-client';
  private localStorage?: Storage;

  constructor(private router: Router,@Inject(DOCUMENT) document: Document,private userService: UserService) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.showHeaderAndFooter = !event.url.includes('/admin');
        });
    });
    this.autoLogin();
  }

  autoLogin() {
    const user = this.localStorage?.getItem('user');
    if (user) {
      const loginDTO: LoginDTO = new LoginDTO(user);
      this.userService.login(loginDTO);
    }
    console.log(user);
  }
}
