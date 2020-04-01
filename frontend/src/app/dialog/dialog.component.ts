import { Component, OnInit, Inject, Optional } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  creationForm : FormGroup;
  userinfo:any;
  constructor(public userservc:UserService,private spinner:NgxSpinnerService,
    private router:Router,
    @Optional() public dialogRef: MatDialogRef<DialogComponent>,
    public toast: ToastrService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogdata,
    public formbuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.creationForm = this.formbuilder.group({
      Tname:[null,Validators.compose([Validators.required])]
    })


    this.userinfo = null;
    this.userinfo = JSON.parse(localStorage.getItem('currentUser'));
  }

  get formControls() { return this.creationForm.controls; }

  
  creationrecord() {
   if (this.creationForm.valid) {
     console.log(this.creationForm.value)
   }
  }

  _handleKeydown(event) {
    if (event.keyCode === 32) {
      event.stopPropagation();
    }
    if (event.which === 32 && event.target.selectionStart === 0) {
      return false;
    }

  }

}
