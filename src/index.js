//campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
//ui
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
  constructor() {
    this.citas = [];
  }
  agregarCita(cita) {
    this.citas = [...this.citas, cita];
  }
  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }
  editarCita(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    //crear el div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('alerta');
    //agregar clase en base al tipo de error
    if (tipo === 'error') {
      divMensaje.classList.add('alerta-error');
    } else {
      divMensaje.classList.add('alerta-exito');
    }
    //mensaje de error
    divMensaje.textContent = mensaje;
    //agregar al dom
    document
      .querySelector('.main-div')
      .insertBefore(divMensaje, document.querySelector('.container'));
    //quitar la alerta
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
  imprimirCitas({ citas }) {
    this.limpiarHtml();
    citas.forEach((cita) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        cita;
      const divCita = document.createElement('div');
      divCita.classList.add('cita');
      divCita.dataset.id = id;
      //scripting de los elementos de la cita
      const mascotaParrafo = document.createElement('h3');
      mascotaParrafo.classList.add('card-title');
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement('p');
      propietarioParrafo.innerHTML = `<span class="parrafo">Propietario: </span> ${propietario}`;

      const telefonoParrafo = document.createElement('p');
      telefonoParrafo.innerHTML = `<span class="parrafo">Teléfono: </span> ${telefono}`;

      const fechaParrafo = document.createElement('p');
      fechaParrafo.innerHTML = `<span class="parrafo">Fecha: </span> ${fecha}`;

      const horaParrafo = document.createElement('p');
      horaParrafo.innerHTML = `<span class="parrafo">Hora: </span> ${hora}`;

      const sintomasParrafo = document.createElement('p');
      sintomasParrafo.innerHTML = `<span class="parrafo">Síntomas: </span> ${sintomas}`;

      //boton para eliminar esta cita
      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn', 'btn--eliminar');
      btnEliminar.innerHTML =
        'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      btnEliminar.onclick = () => eliminarCita(id);
      //boton para editar una cita
      const btnEditar = document.createElement('button');
      btnEditar.classList.add('btn', 'btn--editar');
      btnEditar.innerHTML =
        'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
      btnEditar.onclick = () => cargarEdicion(cita);
      //agregar los parrafos al divCIta
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);
      //agregar las citas al html
      contenedorCitas.appendChild(divCita);
    });
  }
  limpiarHtml() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}
const ui = new UI();
const administrarCitas = new Citas();
//eventos
eventListeners();
function eventListeners() {
  mascotaInput.addEventListener('change', datosCita);
  propietarioInput.addEventListener('change', datosCita);
  telefonoInput.addEventListener('change', datosCita);
  fechaInput.addEventListener('change', datosCita);
  horaInput.addEventListener('change', datosCita);
  sintomasInput.addEventListener('change', datosCita);
  formulario.addEventListener('submit', nuevaCita);
}
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
function datosCita(e) {
  //esto solo funciona si el atributo name del input se llama igual que la propiedad del objeto
  citaObjeto[e.target.name] = e.target.value;
}
//valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
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
function reiniciarObjeto() {
  citaObjeto.mascota = '';
  citaObjeto.propietario = '';
  citaObjeto.telefono = '';
  citaObjeto.fecha = '';
  citaObjeto.hora = '';
  citaObjeto.sintomas = '';
}

function eliminarCita(id) {
  //eliminar cita
  administrarCitas.eliminarCita(id);
  //Muestre un mensaje
  ui.imprimirAlerta('La cita se eliminó correctamente');
  //refrescar las citas
  ui.imprimirCitas(administrarCitas);
}
// carga los datos y modo edicion
function cargarEdicion(cita) {
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
