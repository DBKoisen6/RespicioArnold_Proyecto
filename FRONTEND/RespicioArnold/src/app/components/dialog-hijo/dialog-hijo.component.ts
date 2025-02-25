import { HijoService } from './../../services/hijo.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-hijo',
  imports: [ReactiveFormsModule,MatFormFieldModule,MatInputModule],
  templateUrl: './dialog-hijo.component.html',
  styleUrl: './dialog-hijo.component.scss'
})
export class DialogHijoComponent implements OnInit {

  hijoForm!: FormGroup;
  isEdit: boolean=false;

  constructor(
    private fb: FormBuilder,
    private HijoService: HijoService,
    private dialogRef: MatDialogRef<DialogHijoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    const {idPersonal, idHijo}=this.data || {};
    this.isEdit = !!this.data && !!this.data.idHijo;
    this.hijoForm=this.fb.group({
      idHijo:[idHijo || null],
      tipoDoc:[this.data ? this.data.tipoDoc : '', Validators.required],
      numeroDoc:[this.data ? this.data.numeroDoc : '', Validators.required],
      apellidoPaterno:[this.data ? this.data.apPaterno : '', Validators.required],
      apellidoMaterno:[this.data ? this.data.apMaterno : '', Validators.required],
      primerNombre:[this.data ? this.data.nombre1 : '', Validators.required],
      segundoNombre:[this.data ? this.data.nombre2 : ''],
      fechaNacimiento:[this.data ? this.formatDate(this.data.fechaNac) : '', Validators.required],
      idPersonal:[idPersonal || null]
    });
  }

  save(){
    if(this.hijoForm.invalid) return;

    const hijoData={
      TipoDoc: this.hijoForm.value.tipoDoc,
      NumeroDoc: this.hijoForm.value.numeroDoc,
      ApPaterno: this.hijoForm.value.apellidoPaterno,
      ApMaterno: this.hijoForm.value.apellidoMaterno,
      Nombre1: this.hijoForm.value.primerNombre,
      Nombre2: this.hijoForm.value.segundoNombre || "",
      NombreCompleto: `${this.hijoForm.value.apellidoPaterno} ${this.hijoForm.value.apellidoMaterno}, ${this.hijoForm.value.primerNombre} ${this.hijoForm.value.segundoNombre || ""}`.trim(),
      FechaNac: new Date(this.hijoForm.value.fechaNacimiento),
      idPersonal:this.hijoForm.value.idPersonal
    };

    if(this.isEdit){
      this.HijoService.updateH(this.hijoForm.value.idHijo,hijoData).subscribe({
        next:()=>{
          this.dialogRef.close(true);
        },
        error: (err)=>console.error('Error al actualizar hijo', err)
      });
    } else {
      this.HijoService.createH(hijoData).subscribe({
        next:()=>{
          this.dialogRef.close(true);
        },
        error: (err)=>console.error('Error al registrar hijo', err)
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
