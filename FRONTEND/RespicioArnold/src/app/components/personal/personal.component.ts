import { MatTableModule } from '@angular/material/table';
import { PersonalService } from './../../services/personal.service';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogPersonalComponent } from '../dialog-personal/dialog-personal.component';
import { FormsModule } from '@angular/forms';
import { HijoComponent } from '../hijo/hijo.component';

@Component({
  selector: 'app-personal',
  imports: [CommonModule,FormsModule,MatTableModule,MatIconModule,MatButtonModule, MatDialogModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss'
})
export class PersonalComponent implements OnInit {
  personalList: any[]=[];
  personalListFiltered: any[]=[];
  displayedColumns: string[] = ['idPersonal', 'tipoDoc', 'numeroDoc', 'nombreCompleto', 'edad', 'fechaIngreso', 'acciones'];
  filtro: string='';

  constructor(private PersonalService: PersonalService, private dialog: MatDialog){}

  ngOnInit(): void {
    this.readPersonal();
  }

  calcularEdad(fechaNac: string): number {
    const fechaNacimiento = new Date(fechaNac);
    const diferencia = Date.now() - fechaNacimiento.getTime();
    const edad = new Date(diferencia).getUTCFullYear() - 1970;
    return edad;
  }

  readPersonal(): void{
    this.PersonalService.ReadP().subscribe({
      next: (data)=>{
        this.personalList=data;
        this.personalListFiltered=data;
      },
      error: (err)=>console.error('Error al obtener los datos:',err)
    });
  }

  filtrarPersonal(){
    const search=this.filtro.toLowerCase().trim();
    this.personalListFiltered=this.personalList.filter(personal=>
      personal.nombreCompleto.toLowerCase().includes(search)
    );
  }

  openDialogCreate(){
    const dialogRef=this.dialog.open(DialogPersonalComponent,{
      width:'500px',
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.readPersonal();
      }
    })
  }

  openDialogUpdate(personal: any){
    const dialogRef=this.dialog.open(DialogPersonalComponent,{
      width:'500px',
      disableClose:true,
      data: personal
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.readPersonal();
      }
    })
  }

  deletePersonal(personal: any){
    const confirmDelete=confirm(`¿Está seguro de eliminar al personal ${personal.numeroDoc} - ${personal.nombreCompleto}?`);

    if (confirmDelete) {
      this.PersonalService.DeleteP(personal.idPersonal).subscribe({
        next: () => {
          alert("Personal eliminado correctamente");
          this.readPersonal();
        },
        error: (err) => console.error("Error al eliminar:", err)
      });
    }
  }

  openDialogHijo(personal: any){
    const dialogRef=this.dialog.open(HijoComponent,{
      maxWidth:'90vw',
      height: 'auto',
      maxHeight:'90vh',
      disableClose:true,
      panelClass:'custom-dialog',
      data:{
        idPersonal: personal.idPersonal,
        nombreCompleto: personal.nombreCompleto
      }
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.readPersonal();
      }
    })
  }
}
