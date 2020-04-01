import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import {FormGroup,FormBuilder, Validators} from '@angular/forms'
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userinfo:any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  constructor(public userservc:UserService,public dialog : MatDialog,private spinner:NgxSpinnerService,private router:Router) { }

  ngOnInit() {
    this.userinfo = null;
    this.userinfo = JSON.parse(localStorage.getItem('currentUser'));
  }

  logout(event) {
    event.stopPropagation();
    this.userservc.logout();
  }


  gotoAudit() {
    let dialogRef = this.dialog.open(DialogComponent, {
      height:'auto',
      width:'auto',
      data:{type:'create'},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
