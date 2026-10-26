const $ = (s) => document.querySelector(s);

function avisar(mensaje) {
  $("#avisoTexto").textContent = mensaje;
  bootstrap.Toast.getOrCreateInstance($("#aviso")).show();
}

$("#formPedido").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#alertaPedido").hidden = false;
  e.target.reset();
});