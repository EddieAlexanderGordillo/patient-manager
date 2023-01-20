import Citas from './clases/Citas.js';
import UI from './clases/UI.js';
import {
  mascotaInput,
  propietarioInput,
  fechaInput,
  horaInput,
  sintomasInput,
  telefonoInput,
  formulario,
} from './selectores.js';

const ui = new UI();
const administrarCitas = new Citas();

let editando;

//objeto con la informacion
const citaObjeto = {
  mascota: '',
  propietario: '',
  telefono: '',
  fecha: '',
  hora: '',
  sintomas: '',
};

//agrega datos al objeto de cita
export function datosCita(e) {
  //esto solo funciona si el atributo name del input se llama igual que la propiedad del objeto
  citaObjeto[e.target.name] = e.target.value;
}

//valida y agrega una nueva cita a la clase de citas
export function nuevaCita(e) {
  e.preventDefault();
  //extraer la informacion del obejeto de cita
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObjeto;
  //validar
  if (
    mascota === '' ||
    propietario === '' ||
    telefono === '' ||
    fecha === '' ||
    hora === '' ||
    sintomas == ''
  ) {
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
    return;
  }

  if (editando) {
    ui.imprimirAlerta('Editado Correctamente');
    // pasar el obejeto de la cita a edicion
    administrarCitas.editarCita({ ...citaObjeto });
    //regresar el texto del boton a su estado original
    formulario.querySelector('button[type="submit"]').textContent =
      'Crear Cita';
    //quitar modo edicion
    editando = false;
  } else {
    //generar un id
    citaObjeto.id = Date.now();
    //creando cita
    //usar spread operator para evitar que se reescriba y duplicar registros
    administrarCitas.agregarCita({ ...citaObjeto });
    //mensaje de agregado correctamente
    ui.imprimirAlerta('Se agregó correctamente');
  }
  //reiniciar el objeto para la validacion
  reiniciarObjeto();
  //reiniciar el formulario
  formulario.reset();
  //mostrar el html de las citas
  ui.imprimirCitas(administrarCitas);
}

//funcion para reiniciar el objeto general qie aun contine elementos
export function reiniciarObjeto() {
  citaObjeto.mascota = '';
  citaObjeto.propietario = '';
  citaObjeto.telefono = '';
  citaObjeto.fecha = '';
  citaObjeto.hora = '';
  citaObjeto.sintomas = '';
}

export function eliminarCita(id) {
  //eliminar cita
  administrarCitas.eliminarCita(id);
  //Muestre un mensaje
  ui.imprimirAlerta('La cita se eliminó correctamente');
  //refrescar las citas
  ui.imprimirCitas(administrarCitas);
}

// carga los datos y modo edicion
export function cargarEdicion(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
  //lenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;
  //lenar el objeto
  citaObjeto.mascota = mascota;
  citaObjeto.propietario = propietario;
  citaObjeto.telefono = telefono;
  citaObjeto.fecha = fecha;
  citaObjeto.hora = hora;
  citaObjeto.sintomas = sintomas;
  citaObjeto.id = id;

  //cambiar el texto del boton
  formulario.querySelector('button[type="submit"]').textContent =
    'Guardar Cambios';
  editando = true;
}
