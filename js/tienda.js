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

// ---------- Funciones de la semana 10 ----------
const soles = (monto) => S/ ${monto.toFixed(2)};
const sumar = (...numeros) => numeros.reduce((a, n) => a + n, 0);
const aplicarDescuento = (total, porcentaje = 10) => total * (1 - porcentaje / 100);

function contarUnidades(lista) {
  if (lista.length === 0) return 0;
  const [primero, ...resto] = lista;
  return primero.cantidad + contarUnidades(resto);
}

function crearCarrito(itemsIniciales = []) {
  let items = itemsIniciales;
  return {
    agregar(producto, cantidad = 1) {
      const existe = items.find((it) => it.id === producto.id);
      if (existe) existe.cantidad += cantidad;
      else items.push({ ...producto, cantidad });
    },
    quitar(id) { items = items.filter((it) => it.id !== id); },
    vaciar() { items = []; },
    lista: () => items,
    subtotal: () => sumar(...items.map((it) => it.precio * it.cantidad)),
    unidades: () => contarUnidades(items),
  };
}

// ---------- Carrito de la tienda ----------
const carrito = crearCarrito(JSON.parse(localStorage.getItem("carrito-delicia") || "[]"));

function pintarCarrito() {
  const sub = carrito.subtotal();
  const conDescuento = sub > 100;
  const total = conDescuento ? aplicarDescuento(sub) : sub;
  $("#listaCarrito").innerHTML = carrito.lista().map((it) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span>${it.nombre} × ${it.cantidad}</span>
      <span>${soles(it.precio * it.cantidad)}
        <button class="btn btn-sm btn-outline-danger ms-2" data-quitar="${it.id}" aria-label="Quitar ${it.nombre}">✕</button>
      </span>
    </li>).join("") || `<li class="list-group-item text-secondary">Aún no agregas productos.</li>;
  $("#subtotal").textContent = soles(sub);
  $("#descuento").textContent = conDescuento ? "Descuento del 10 % aplicado" : "";
  $("#total").textContent = soles(total);
  $("#contador").textContent = carrito.unidades();
  localStorage.setItem("carrito-delicia", JSON.stringify(carrito.lista()));
}

$("#listaCarrito").addEventListener("click", (e) => {
  const boton = e.target.closest("[data-quitar]");
  if (!boton) return;
  carrito.quitar(Number(boton.dataset.quitar));
  pintarCarrito();
});
$("#vaciar").addEventListener("click", () => { carrito.vaciar(); pintarCarrito(); });