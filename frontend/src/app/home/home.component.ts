import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userinfo:any;
  constructor(public userservc:UserService,private spinner:NgxSpinnerService,private router:Router) { }

  ngOnInit() {
    this.userinfo = null;
    this.userinfo = JSON.parse(localStorage.getItem('currentUser'));
  }

  logout(event) {
    event.stopPropagation();
    this.spinner.show();
   this.userservc.logoutupdate().subscribe((data:any) => {
     this.userservc.logout();
     this.spinner.hide();
   }, err => {
    this.spinner.hide();
   })
  }


  gotoAudit() {
    this.router.navigate(['audit'])
  }
}
