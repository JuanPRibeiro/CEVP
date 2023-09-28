import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-deactivate-student-dlg',
  templateUrl: './deactivate-student-dlg.component.html',
  styleUrls: ['./deactivate-student-dlg.component.css']
})
export class DeactivateStudentDlgComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { schools: any[] },
    private dialog: MatDialog,
    protected dialogRef: MatDialogRef<DeactivateStudentDlgComponent>
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  
  sendReason(reason: String): void {
    this.dialogRef.close(reason);
  }
}
