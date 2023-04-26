import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TarjetaService } from './services/tarjeta.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TarjetaCredito';
  listaTarjetas: any[] = [
    // {
    //   titular: 'yhors',
    //   numeroTarjeta: '123456789',
    //   fechaExpiracion: '11/12',
    //   cvv: '123',
    // },
    // {
    //   titular: 'brayan',
    //   numeroTarjeta: '987654321',
    //   fechaExpiracion: '13/12',
    //   cvv: '123',
    // },
  ];

  form: FormGroup;
  accion = 'agregar';
  id: number | undefined;

  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _tarjetaService: TarjetaService
  ) {
    this.form = fb.group({
      titular: ['Yhors Brayan', Validators.required],
      numeroTarjeta: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ],
      ],
      fechaExpiracion: [
        '12/11',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ],
      ],
      cvv: [
        '123',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.obtenerTarjetas();
  }

  obtenerTarjetas() {
    this._tarjetaService.getTarjetas().subscribe(
      (data) => {
        // console.log(data);
        this.listaTarjetas = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  guardarTarjeta() {
    // console.log(this.form);
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    };

    if (this.id == undefined) {
      // agregamos una tarjeta
      // console.warn(tarjeta);
      // this.listaTarjetas.push(tarjeta);
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(
        (data) => {
          this._toastr.success(
            'La Tarjeta fue registrada con EXITO!',
            'Tarjeta Registrada!'
          );
          this.obtenerTarjetas();
          this.form.reset();
        },
        (err) => {
          this._toastr.warning('err.error.message', 'ERROR');
          console.error(err);
        }
      );
    } else {
      // editamos una tarjeta
      tarjeta.id = this.id;
      this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(
        (data) => {
          this.form.reset();
          this.accion = 'agregar';
          this.id = undefined;
          this._toastr.info(
            'la tarjeta fue actualizada',
            'Tarjeta Actualizada'
          );
          this.obtenerTarjetas();
        },
        (err) => {
          this._toastr.error(err.error.message, 'ERROR');
          console.warn(err);
        }
      );
    }
  }

  eliminarTarjeta(i: number) {
    this._tarjetaService.deleteTarjeta(i).subscribe(
      (data) => {
        this._toastr.warning(
          'La Tarjeta fue Eliminada con EXITO!',
          'Tarjeta Eliminada!'
        );
        this.obtenerTarjetas();
      },
      (err) => {
        console.error(err);
      }
    );
    // this.listaTarjetas.splice(i, 1);
    // this._toastr.error(
    //   'La Tarjeta fue Eliminada con EXITO!',
    //   'Tarjeta Eliminada!'
    // );
  }

  editarTarjeta(tarjeta: any, i: number) {
    // console.warn(tarjeta);
    this.accion = 'editar';
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv,
    });
  }
}
