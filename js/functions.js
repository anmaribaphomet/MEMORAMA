
"use strict";

const imagenes = [
    "1.jpg", "1.jpg",
    "2.jpg", "2.jpg",
    "3.jpg", "3.jpg",
    "4.jpg", "4.jpg",
    "5.jpg", "5.jpg",
    "6.jpg", "6.jpg",
    "7.jpg", "7.jpg",
    "8.jpg", "8.jpg",
    "9.jpg", "9.jpg",
    "10.jpg", "10.jpg"
];

let carpeta = "";
let carpeta2 = "";
let carpeta3 = "";

let tarjetas = [];
let primeraTarjeta = null;
let segundaTarjeta = null;
let bloqueado = false;

let parejasEncontradas = 0;
let intentos = 0;
let juegoTerminado = false;

// Selección de tema

function elegirTema(tema) {
    if (tema === 1) {
        carpeta = "./img/girl/0.jpg";
        carpeta2 = "./img/girl/";
        carpeta3 = "./img/background/girl/";
    } else if (tema === 2) {
        carpeta = "./img/boy/0.jpg";
        carpeta2 = "./img/boy/";
        carpeta3 = "./img/background/boy/";
    } else {
        return;
    }

    document.getElementById("modal").style.display = "none";

    iniciarJuego();
}

// Mezclar tarjetas

function revolverArreglo(arreglo) {
    const copia = [...arreglo];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

// Iniciar o reiniciar juego

function iniciarJuego() {
    tarjetas = revolverArreglo(imagenes);

    primeraTarjeta = null;
    segundaTarjeta = null;
    bloqueado = false;

    parejasEncontradas = 0;
    intentos = 0;
    juegoTerminado = false;

    actualizarEstadisticas();
    construirJuego();

    document.getElementById("victoria").style.display = "none";
}

// Construir tablero

function construirJuego() {
    const numeroFondo = Math.floor(Math.random() * 3) + 1;

    const tablero = document.getElementById("juego");

    tablero.style.backgroundImage =
        `url("${carpeta3}${numeroFondo}.jpg")`;

    tablero.innerHTML = "";

    tarjetas.forEach((imagen, indice) => {
        const boton = document.createElement("button");

        boton.className = "memory-card";
        boton.type = "button";
        boton.setAttribute("aria-label", `Tarjeta ${indice + 1}`);

        const img = document.createElement("img");

        img.src = carpeta;
        img.alt = "Tarjeta oculta";

        boton.appendChild(img);

        boton.addEventListener("click", () => {
            cambiar(boton, indice);
        });

        tablero.appendChild(boton);
    });
}

// Voltear tarjeta

function cambiar(boton, indice) {
    if (bloqueado || juegoTerminado) return;
    if (boton.classList.contains("matched")) return;
    if (boton === primeraTarjeta) return;
    if (boton === segundaTarjeta) return;

    const img = boton.querySelector("img");

    img.src = carpeta2 + tarjetas[indice];
    boton.setAttribute("aria-label", "Tarjeta descubierta");

    if (!primeraTarjeta) {
        primeraTarjeta = boton;
        return;
    }

    segundaTarjeta = boton;
    intentos++;

    actualizarEstadisticas();

    comprobarPareja();
}

// Comprobar si son iguales

function comprobarPareja() {
    bloqueado = true;

    const imagen1 = primeraTarjeta.querySelector("img").src;
    const imagen2 = segundaTarjeta.querySelector("img").src;

    if (imagen1 === imagen2) {
        setTimeout(() => {
            primeraTarjeta.classList.add("matched");
            segundaTarjeta.classList.add("matched");

            primeraTarjeta.disabled = true;
            segundaTarjeta.disabled = true;

            parejasEncontradas++;

            actualizarEstadisticas();

            limpiarSeleccion();

            if (parejasEncontradas === 10) {
                terminarJuego();
            }
        }, 350);

    } else {
        setTimeout(() => {
            ocultarTarjeta(primeraTarjeta);
            ocultarTarjeta(segundaTarjeta);

            limpiarSeleccion();
        }, 900);
    }
}

// Volver a ocultar tarjeta

function ocultarTarjeta(boton) {
    const img = boton.querySelector("img");

    img.src = carpeta;
    boton.setAttribute("aria-label", "Tarjeta oculta");
}

// Limpiar selección

function limpiarSeleccion() {
    primeraTarjeta = null;
    segundaTarjeta = null;
    bloqueado = false;
}

// Actualizar estadísticas

function actualizarEstadisticas() {
    document.getElementById("parejas").textContent =
        `${parejasEncontradas} / 10`;

    document.getElementById("intentos").textContent = intentos;

    document.getElementById("progreso").style.width =
        `${parejasEncontradas * 10}%`;
}

// Victoria

function terminarJuego() {
    juegoTerminado = true;

    document.getElementById("resumen-victoria").textContent =
        `Lo lograste en ${intentos} intentos. ¡Excelente memoria!`;

    document.getElementById("victoria").style.display = "flex";
}

// Botones

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("reiniciar").addEventListener("click", () => {
        if (carpeta) {
            iniciarJuego();
        } else {
            document.getElementById("modal").style.display = "flex";
        }
    });

    document.getElementById("jugar-otra-vez").addEventListener("click", () => {
        iniciarJuego();
    });
});
