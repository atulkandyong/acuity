import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'add-unavailability',
  templateUrl: './add-unavailability.component.html'
})
export class AddUnavailabilityDialog {
  form: FormGroup;
  description: string;

  constructor(
    private fb: FormBuilder, private http: HttpClient, private dialogRef: MatDialogRef<AddUnavailabilityDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.form = fb.group({
      description: [data.description, Validators.required],
      startDate: [data.startDate, Validators.required],
      endDate: [data.endDate, Validators.required],
    });
  }

  save() {
    debugger;
    this.form.value.startDate = Date.parse(this.form.value.startDate.toString());
    this.form.value.endDate = Date.parse(this.form.value.endDate.toString());
    return this.http.post('api/brandSpecialistUnavailability', this.form.value).subscribe((result: any) => {
      this.dialogRef.close('success');
    }, error => console.error(error));
  }

  close(result) {
    this.dialogRef.close(result);
  }
}