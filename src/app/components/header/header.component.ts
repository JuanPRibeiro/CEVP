import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  protected userData: any;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("user"));
  }

}
