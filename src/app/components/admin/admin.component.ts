import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserReponse } from '../../responses/UserReponse';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  imports: [
    RouterLink,
    NgClass,
    RouterOutlet
  ],
  standalone: true
})
export class AdminComponent implements OnInit {
  userResponse?: UserReponse;
  adminComponent: string = 'orders';
  showSidebar: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
  ) {}

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalstorage();
  }

  logout() {
    this.userService.logout();
    window.location.reload();
  }

  onSelect(component: string) {
    this.adminComponent = component;
  }

  onHideIconClick() {
    this.showSidebar = !this.showSidebar;
  }
}
