import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FilterPipe } from '../filter.pipe';
import * as moment from 'moment'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FilterPipe]

})
export class HomeComponent implements OnInit {
  userinfo:any;
 usersTasks = [];
  AllTasks = [];
  expiryusers = [];
  constructor( public toast: ToastrService,
    public userservc:UserService,public dialog : MatDialog,
    private spinner:NgxSpinnerService,private router:Router) { }

  ngOnInit() {
    this.userinfo = null;
    this.userinfo = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.userinfo);
    this.startup();
    this.startupAlltasks();
    this.startupUserexpiry();

    const obj = {
      type:'connect',
      username:this.userinfo.username
    }
    this.userservc.Connectsocket(obj);
    this.userservc.taskAnyNew().subscribe((data: any) => {
      console.log(data)
      if (data && data.username === this.userinfo.username) {

      }else {
        this.toast.success('New Task Has been Added by' +' '+ data.firstname);
      }
    })
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
      if (result === false) {
        this.startup();
        this.startupAlltasks();
      }
    });
  }


  startup() {
    this.spinner.show()
    this.userservc.getUserTasks('userslist').subscribe((data: any) => {
    this.usersTasks = [];
    this.usersTasks = data;
    this.usersTasks.forEach(element=>{
      element.createdAt = moment(element.createdAt).format('ddd, MMM D, YYYY hh:mm:ss A');
    })
    console.log(this.usersTasks);
    this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toast.error(err);
    })
  }

  startupAlltasks() {
    this.userservc.getAllTasks().subscribe((data: any) => {
      this.AllTasks = [];
      this.AllTasks = data;
      this.AllTasks.forEach(element=>{
        element.createdAt = moment(element.createdAt).format('ddd, MMM D, YYYY hh:mm:ss A');
      })
      console.log(this.AllTasks);
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toast.error(err);
    })
  }

  startupUserexpiry() {
    this.userservc.getUserTasks('expirylist').subscribe((data: any) => {
      this.expiryusers = [];
      this.expiryusers = data;
      this.expiryusers.forEach(element=>{
        element.createdAt = moment(element.createdAt).format('ddd, MMM D, YYYY hh:mm:ss A');
        element.status = 'Expired'
      })
      console.log(this.expiryusers);
      this.spinner.hide();
      }, err => {
        this.spinner.hide();
        this.toast.error(err);
      })
  }

  openupdation(i,type) {
    console.log(i);
    let dialogRef = this.dialog.open(DialogComponent, {
      height:'auto',
      width:'auto',
      data:{type:type,recordData:i},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === false) {
        this.startup();
        this.startupAlltasks();
      }
    });
  }
}
