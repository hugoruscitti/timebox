function actualizarIndicador() {
  const primerBloque = document.querySelector(".bloque");
  const ALTURA_DE_BLOQUE = primerBloque.getBoundingClientRect().height;
  const hoy = new Date();
  const indicador = document.querySelector("#indicador");
  const hora = hoy.getHours();
  const minutos = hoy.getMinutes();
  const minutosDesde9AM = (hora - 9) * 60 + minutos;
  const deltaDesde9AM = minutosDesde9AM / 60;

  const dy = Math.floor(deltaDesde9AM * ALTURA_DE_BLOQUE);

  indicador.style.top = `${dy}px`;
  console.log("update", `${dy}px`);
}

function dibujarDia() {
  const contenedor = document.querySelector("#dia");

  navigator.serviceWorker
    .register(new URL('service-worker.js', import.meta.url), {type: 'module'})
    .then(() => {
      console.log('Service worker registered');
    })
    .catch(err => {
      console.log('Service worker registration failed: ' + err);
    });

  const horas = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  horas.map(hora => {
    const template = document.querySelector("#bloque");
    const item = template.content.cloneNode(true);
    item.querySelector(".hora label").textContent = `${hora}`;

    const data = localStorage.getItem(hora, "");
    item.querySelector("#detalle").value = data;
    item.querySelector("#detalle").addEventListener("change", function(event) {
      localStorage.setItem(hora, event.target.value);
    });

    contenedor.appendChild(item);
  })

}

window.addEventListener("DOMContentLoaded", function() {
  dibujarDia();
  actualizarIndicador();

  setInterval(actualizarIndicador, 1000);
});
