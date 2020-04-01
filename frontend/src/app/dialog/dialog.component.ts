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
  updateForm: FormGroup;
  userinfo:any;
  todayDate = new Date(); // today date as minimum value for expiry date
  statusvalues= ['Pending','Completed'];
  constructor(public userservc:UserService,private spinner:NgxSpinnerService,
    private router:Router,
    @Optional() public dialogRef: MatDialogRef<DialogComponent>,
    public toast: ToastrService,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogdata,
    public formbuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.creationForm = this.formbuilder.group({
      Tname:[null,Validators.compose([Validators.required])],
      expires_At:[null,Validators.compose([Validators.required])]
    })
    this.updateForm = this.formbuilder.group({
      status:[null,Validators.compose([Validators.required])]
    })

    this.updateForm.get('status').setValue('Pending')

    this.userinfo = null;
    this.userinfo = JSON.parse(localStorage.getItem('currentUser'));
  }

  get formControls() { return this.creationForm.controls; }
  get formControls1() { return this.updateForm.controls; }



  creationrecord() {
   if (this.creationForm.valid) {
     this.spinner.show();
     console.log(this.creationForm.value)
     this.userservc.createTask(this.creationForm.value).subscribe((data: any) => {
     console.log(data);
     this.spinner.hide();
     if(data && data.success) {
     this.toast.success(data.success);
     this.dialogRef.close(false);
     } else if (data && data.message) {
     this.toast.warning(data.message);
     }

     }, err => {
       this.spinner.hide();
       this.toast.error(err);
     })
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

  deleteRecord() {
   this .spinner.show();
   this.userservc.deleteTask(this.dialogdata.recordData._id).subscribe((data: any) => {
      if( data && data.success) {
        this.toast.success(data.success);
        this.dialogRef.close(false);
      } else if (data && data.message) {
        this.toast.warning(data.message);
      }
      this.spinner.hide();
    },err => {
      this.spinner.hide();
      this.toast.error(err);
    })
  }


  updateRecord(event) {
    event.stopPropagation();
    if(this.updateForm.valid) {
      this.spinner.show();
      const obj ={ 
        taskid:this.dialogdata.recordData._id,
        status:this.updateForm.value.status
      }
      this.userservc.updateTask(obj).subscribe((data: any) => {
        if( data && data.success) {
          this.toast.success(data.success);
          this.dialogRef.close(false);
        } else if (data && data.message) {
          this.toast.warning(data.message);
        }
        this.spinner.hide();
      },err => {
        this.spinner.hide();
        this.toast.error(err);
      })
    }
  }

}
