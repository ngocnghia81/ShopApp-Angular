import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import { UserReponse } from '../../responses/UserReponse';
import { UserService } from '../../services/user.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownMenu, RouterLink, NgbDropdownItem, NgbDropdown, NgbDropdownToggle, FaIconComponent],
})
export class HeaderComponent implements OnInit, OnChanges {
  userResponse?: UserReponse;
  isDropdownOpen: boolean = false;
  isLogged: boolean = false;

  activeNavItem: number = 1;

  // @ViewChild(NgbDropdown, { static: false }) dropDown: NgbDropdown;

  constructor(
    private userService: UserService,
    private router: Router,
    private ActiveRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.userResponse =
      this.userService.getUserResponseFromLocalstorage() ||
      this.userService.getUserResponseFromSessionstorage();
    this.isLogged = this.userResponse !== null;
  }

  openDropdown() {
    this.isDropdownOpen = true;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    debugger;
    this.isLogged = false;
    this.userService.logout();
    window.location.reload();
  }

  setActiveNavItem(index: number) {
    this.activeNavItem = index;
  }

  handleClickItem(index: number) {
    if (index === 0) {
      this.navigateTo('/user-profile');
    } else if (index === 1) {
      this.navigateTo('/orders');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isLogged = !!this.userResponse;
  }

  protected readonly faShoppingCart = faShoppingCart;
}
