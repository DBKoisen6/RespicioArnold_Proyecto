import { PersonalService } from './../../services/personal.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-personal',
  imports: [ReactiveFormsModule,MatFormFieldModule,MatInputModule],
  templateUrl: './dialog-personal.component.html',
  styleUrl: './dialog-personal.component.scss'
})
export class DialogPersonalComponent implements OnInit {

  personalForm!: FormGroup;
  isEdit: boolean=false;

  constructor(
    private fb: FormBuilder,
    private PersonalService: PersonalService,
    private dialogRef: MatDialogRef<DialogPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEdit=!!this.data;
    this.personalForm=this.fb.group({
      idPersonal:[this.data ? this.data.idPersonal : null],
      tipoDoc:[this.data ? this.data.tipoDoc : '', Validators.required],
      numeroDoc:[this.data ? this.data.numeroDoc : '', Validators.required],
      apellidoPaterno:[this.data ? this.data.apPaterno : '', Validators.required],
      apellidoMaterno:[this.data ? this.data.apMaterno : '', Validators.required],
      primerNombre:[this.data ? this.data.nombre1 : '', Validators.required],
      segundoNombre:[this.data ? this.data.nombre2 : ''],
      fechaNacimiento:[this.data ? this.formatDate(this.data.fechaNac) : '', Validators.required],
    });

    if(this.data){
      this.isEdit=true;
    }
  }

  save(){
    if(this.personalForm.invalid) return;

    const personalData={
      TipoDoc: this.personalForm.value.tipoDoc,
      NumeroDoc: this.personalForm.value.numeroDoc,
      ApPaterno: this.personalForm.value.apellidoPaterno,
      ApMaterno: this.personalForm.value.apellidoMaterno,
      Nombre1: this.personalForm.value.primerNombre,
      Nombre2: this.personalForm.value.segundoNombre || "",
      NombreCompleto: `${this.personalForm.value.apellidoPaterno} ${this.personalForm.value.apellidoMaterno}, ${this.personalForm.value.primerNombre} ${this.personalForm.value.segundoNombre || ""}`.trim(),
      FechaNac: new Date(this.personalForm.value.fechaNacimiento)
    };

    if(this.isEdit){
      this.PersonalService.UpdateP(this.personalForm.value.idPersonal,personalData).subscribe({
        next:()=>{
          this.dialogRef.close(true);
        },
        error: (err)=>console.error('Error al actualizar personal', err)
      });
    } else {
      this.PersonalService.CreateP(personalData).subscribe({
        next:()=>{
          this.dialogRef.close(true);
        },
        error: (err)=>console.error('Error al registrar personal', err)
      });
    }
  }

  cancel(){
    this.dialogRef.close(false);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return dateString.split('T')[0];
  }
}
