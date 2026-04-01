const slider = document.getElementById("plazo");
const textoPlazo = document.getElementById("valorPlazo");
const formulario = document.getElementById("formularioVivienda");
const btnGuardar = document.getElementById("btnGuardar");
const btnProyeccion = document.getElementById("btnProyeccion");

slider.addEventListener("input", function () {
  textoPlazo.textContent = slider.value;
  calcularPagoMensual();
});

document.getElementById("montoSolicitar").addEventListener("input", calcularPagoMensual);
document.getElementById("tasaInteres").addEventListener("input", calcularPagoMensual);
document.getElementById("valorVivienda").addEventListener("input", function () {
  validarMonto();
  calcularPagoMensual();
});
document.getElementById("salario").addEventListener("input", calcularPagoMensual);
document.getElementById("fechaNacimiento").addEventListener("change", calcularPagoMensual);

btnGuardar.addEventListener("click", guardarDatos);
btnProyeccion.addEventListener("click", mostrarProyeccion);

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  let valorVivienda = parseFloat(document.getElementById("valorVivienda").value) || 0;
  let montoSolicitar = parseFloat(document.getElementById("montoSolicitar").value) || 0;

  if (montoSolicitar > valorVivienda * 0.80) {
    alert("El monto a solicitar no puede ser mayor al 80% del valor de la vivienda.");
    return;
  }

  calcularPagoMensual();
});

function validarMonto() {
  let valorVivienda = parseFloat(document.getElementById("valorVivienda").value) || 0;
  let montoSolicitar = document.getElementById("montoSolicitar");
  montoSolicitar.max = valorVivienda * 0.80;
}

function calcularPagoMensual() {
  let salario = parseFloat(document.getElementById("salario").value) || 0;
  let montoSolicitar = parseFloat(document.getElementById("montoSolicitar").value) || 0;
  let tasaInteres = parseFloat(document.getElementById("tasaInteres").value) || 0;
  let plazo = parseFloat(document.getElementById("plazo").value) || 0;
  let valorVivienda = parseFloat(document.getElementById("valorVivienda").value) || 0;

  if (montoSolicitar <= 0 || tasaInteres <= 0 || plazo <= 0) {
    document.getElementById("pagoMensual").value = "";
    document.getElementById("salarioMinimo").value = "";
    document.getElementById("estadoSalario").value = "";
    document.getElementById("estadoEdad").value = "";
    document.getElementById("porcentajeFinanciar").value = "";
    return;
  }

  let i = (tasaInteres / 100) / 12;
  let n = plazo;

  let pagoMensual = montoSolicitar * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  document.getElementById("pagoMensual").value = pagoMensual.toFixed(2);

  let salarioMinimo = pagoMensual / 0.40;
  document.getElementById("salarioMinimo").value = salarioMinimo.toFixed(2);

  if (salario >= salarioMinimo) {
    document.getElementById("estadoSalario").value = "Monto de salario suficiente para el crédito";
  } else {
    document.getElementById("estadoSalario").value = "Monto de salario insuficiente";
  }

  let fechaNacimiento = document.getElementById("fechaNacimiento").value;
  if (fechaNacimiento !== "") {
    let edad = calcularEdad(fechaNacimiento);

    if (edad > 22 && edad < 55) {
      document.getElementById("estadoEdad").value = "Cliente con edad suficiente para crédito";
    } else {
      document.getElementById("estadoEdad").value = "Cliente no califica para crédito por edad";
    }
  } else {
    document.getElementById("estadoEdad").value = "";
  }

  if (valorVivienda > 0) {
    let porcentaje = (montoSolicitar / valorVivienda) * 100;
    document.getElementById("porcentajeFinanciar").value = porcentaje.toFixed(2) + "%";
  } else {
    document.getElementById("porcentajeFinanciar").value = "";
  }
}

function calcularEdad(fechaNacimiento) {
  let hoy = new Date();
  let nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  let mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

function guardarDatos() {
  let datos = {
    correo: document.getElementById("correo").value,
    nombre: document.getElementById("nombre").value,
    fechaNacimiento: document.getElementById("fechaNacimiento").value,
    salario: document.getElementById("salario").value,
    tasaInteres: document.getElementById("tasaInteres").value,
    plazo: document.getElementById("plazo").value,
    valorVivienda: document.getElementById("valorVivienda").value,
    montoSolicitar: document.getElementById("montoSolicitar").value
  };

  localStorage.setItem("datosCredito", JSON.stringify(datos));
  alert("Datos guardados correctamente");
}

function cargarDatos() {
  let datosGuardados = localStorage.getItem("datosCredito");

  if (datosGuardados) {
    let datos = JSON.parse(datosGuardados);

    document.getElementById("correo").value = datos.correo || "";
    document.getElementById("nombre").value = datos.nombre || "";
    document.getElementById("fechaNacimiento").value = datos.fechaNacimiento || "";
    document.getElementById("salario").value = datos.salario || "";
    document.getElementById("tasaInteres").value = datos.tasaInteres || "7.10";
    document.getElementById("plazo").value = datos.plazo || "15";
    document.getElementById("valorPlazo").textContent = datos.plazo || "15";
    document.getElementById("valorVivienda").value = datos.valorVivienda || "";
    document.getElementById("montoSolicitar").value = datos.montoSolicitar || "";

    calcularPagoMensual();
  }
}

function mostrarProyeccion() {
  let montoSolicitar = parseFloat(document.getElementById("montoSolicitar").value) || 0;
  let tasaInteres = parseFloat(document.getElementById("tasaInteres").value) || 0;
  let plazo = parseInt(document.getElementById("plazo").value) || 0;

  if (montoSolicitar <= 0 || tasaInteres <= 0 || plazo <= 0) {
    alert("Primero complete los datos del crédito");
    return;
  }

  let i = (tasaInteres / 100) / 12;
  let n = plazo;
  let pagoMensual = montoSolicitar * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);

  let saldo = montoSolicitar;

  let tabla = `
    <h4 class="mt-4 mb-3">Proyección de Crédito</h4>
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>Mes</th>
            <th>Pago Mensual</th>
            <th>Intereses</th>
            <th>Amortización</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
  `;

  for (let mes = 1; mes <= n; mes++) {
    let intereses = saldo * i;
    let amortizacion = pagoMensual - intereses;
    saldo = saldo - amortizacion;

    if (saldo < 0) {
      saldo = 0;
    }

    tabla += `
      <tr>
        <td>${mes}</td>
        <td>${pagoMensual.toFixed(2)}</td>
        <td>${intereses.toFixed(2)}</td>
        <td>${amortizacion.toFixed(2)}</td>
        <td>${saldo.toFixed(2)}</td>
      </tr>
    `;
  }

  tabla += `
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("contenedorProyeccion").innerHTML = tabla;
}

window.addEventListener("load", cargarDatos);