import { HijoService } from './../../services/hijo.service';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DialogHijoComponent } from '../dialog-hijo/dialog-hijo.component';

@Component({
  selector: 'app-hijo',
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './hijo.component.html',
  styleUrl: './hijo.component.scss'
})
export class HijoComponent {
  hijoList: any[]=[];
  hijoListFiltered: any[]=[];
  displayedColumns: string[] = ['idHijo', 'tipoDoc', 'numeroDoc', 'nombreCompleto', 'edad', 'fechaNacimiento', 'acciones'];
  filtro: string='';

  constructor(
    private HijoService: HijoService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<HijoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void{
    this.readHijo();
  }

  calcularEdad(fechaNac: string): number {
    const fechaNacimiento = new Date(fechaNac);
    const diferencia = Date.now() - fechaNacimiento.getTime();
    const edad = new Date(diferencia).getUTCFullYear() - 1970;
    return edad;
  }

  readHijo():void{
    this.HijoService.readH(this.data.idPersonal).subscribe({
      next: (data)=>{
        this.hijoList=data;
        this.hijoListFiltered=data;
      },
      error: (err)=>console.error('Error al obtener al hijo:', err)
    });
  }

  filtrarHijo(){
    const search=this.filtro.toLowerCase().trim();
    this.hijoListFiltered=this.hijoList.filter(hijo=>
      hijo.nombreCompleto.toLowerCase().includes(search)
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openDialogCreate(){
    const dialogRef=this.dialog.open(DialogHijoComponent,{
      width:'500px',
      disableClose:true,
      data: {idPersonal:this.data.idPersonal}
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.readHijo();
      }
    })
  }
  
  openDialogUpdate(hijo: any){
    const dialogRef=this.dialog.open(DialogHijoComponent,{
      width:'500px',
      disableClose:true,
      data: hijo
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.readHijo();
      }
    })
  }

  deleteHijo(hijo: any){
    const confirmDelete=confirm(`¿Está seguro de eliminar al hijo ${hijo.numeroDoc} - ${hijo.nombreCompleto}?`);

    if (confirmDelete) {
      this.HijoService.deleteH(hijo.idHijo).subscribe({
        next: () => {
          alert("Hijo eliminado correctamente");
          this.readHijo();
        },
        error: (err) => console.error("Error al eliminar:", err)
      });
    }
  }
}
