let alumnoActual = null;

function iniciarSesion() {
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  alumnoActual = alumnos.find(a => a.usuario === usuario && a.password === password);

  if (alumnoActual) {
    document.getElementById("login").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("nombreAlumno").textContent = `IS 2025-2. ${alumnoActual.nombre}`;
    mostrarSecciones();
  } else {
    error.textContent = "Usuario o contraseña incorrectos.";
  }
}

function mostrarSecciones() {
  mostrarLista('lista-ejercicios', alumnoActual.ejercicios, true);
  mostrarLista('lista-tareas', alumnoActual.tareas, true);
  mostrarExamenesDetallados('lista-examenes', alumnoActual.examenes);
  mostrarProyecto('lista-proyecto', alumnoActual.proyecto);
  mostrarAsistencias('lista-asistencias', alumnoActual.asistencias);
  mostrarResumen();
}

function mostrarLista(id, elementos, mostrarTitulo = false) {
  const lista = document.getElementById(id);
  lista.innerHTML = '';

  elementos.forEach(el => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${mostrarTitulo ? `<strong>${el.titulo}</strong><br>` : ''}
      Fecha: ${el.fecha}<br>
      Calificación: ${el.calificacion}<br>
      Archivo: ${el.archivo ? `<a href="${el.archivo}" target="_blank">Ver</a>` : 'N/A'}<br>
      Feedback: ${el.feedback}
    `;
    lista.appendChild(li);
  });
}

function mostrarExamenesDetallados(id, examenes) {
  const lista = document.getElementById(id);
  lista.innerHTML = '';

  examenes.forEach(ex => {
    const total = ex.calificacion + (ex.puntosExtra?.reduce((a, b) => a + b, 0) || 0);
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${ex.titulo}</strong><br>
      Tema: ${ex.tema}<br>
      Calificación base: ${ex.calificacion}, puntos extra: ${ex.puntosExtra?.join(", ") || "0"}<br>
      Total: <strong>${total}</strong>
    `;
    lista.appendChild(li);
  });
}

function mostrarProyecto(id, proyecto) {
  const lista = document.getElementById(id);
  lista.innerHTML = `
    📄 Requerimientos (5%): ${proyecto.requerimientos}<br>
    🗣 Exposición (35%): ${proyecto.exposicion}<br>
    📘 Documento (60%): ${proyecto.documento}
  `;
}

function mostrarAsistencias(id, asistencias) {
  const lista = document.getElementById(id);
  lista.innerHTML = '';

  asistencias.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `Fecha: ${a.fecha} - ${a.estado}`;
    if (a.estado === "Justificada") {
      li.innerHTML += `<br>Motivo: ${a.motivo || 'No especificado'}`;
      li.innerHTML += a.archivo ? `<br>Archivo: <a href="${a.archivo}" target="_blank">Ver</a>` : '';
    }
    lista.appendChild(li);
  });
}

function mostrarResumen() {
  const resumenDiv = document.getElementById('resumenFinal');
  const a = alumnoActual;

  const promedio = arr => arr.length ? arr.reduce((s, i) => s + i.calificacion, 0) / arr.length : 0;

  const promedioEjercicios = promedio(a.ejercicios);
  const promedioTareas = promedio(a.tareas);

  const promedioExamenes = a.examenes.length
    ? a.examenes.reduce((s, ex) => s + ex.calificacion + (ex.puntosExtra?.reduce((a, b) => a + b, 0) || 0), 0) / a.examenes.length
    : 0;

  const promedioProyecto =
    a.proyecto.requerimientos * 0.05 +
    a.proyecto.exposicion * 0.35 +
    a.proyecto.documento * 0.60;

  const asistenciasTotales = a.asistencias.length;
  const asistenciasValidas = a.asistencias.filter(x => x.estado === "Asistió").length;
  const faltasJustificadas = a.asistencias.filter(x => x.estado === "Justificada").length;

  const porcentajeAsistencias = asistenciasTotales
    ? (asistenciasValidas / asistenciasTotales) * 100
    : 100;

  const tieneBonus = porcentajeAsistencias === 100 && faltasJustificadas <= 2;

  const calFinal =
    promedioExamenes * 0.30 +
    promedioEjercicios * 0.15 +
    promedioTareas * 0.15 +
    promedioProyecto * 0.40;

  const finalConBonus = tieneBonus ? Math.min(10, calFinal * 1.05) : calFinal;

  resumenDiv.innerHTML = `
    <h3>Resumen Final</h3>
    <ul>
      <li>📊 Ejercicios: ${promedioEjercicios.toFixed(2)} (15%)</li>
      <li>📊 Tareas: ${promedioTareas.toFixed(2)} (15%)</li>
      <li>📝 Exámenes: ${promedioExamenes.toFixed(2)} (30%)</li>
      <li>📁 Proyecto: ${promedioProyecto.toFixed(2)} (40%)</li>
      <li>📅 Asistencias: ${asistenciasValidas}/${asistenciasTotales} (${porcentajeAsistencias.toFixed(0)}%), justificadas: ${faltasJustificadas}</li>
      <li>🎁 Bonus aplicado: ${tieneBonus ? 'Sí (+5%)' : 'No'}</li>
      <li><strong>✅ Calificación final: ${finalConBonus.toFixed(2)}</strong></li>
    </ul>
  `;
}
