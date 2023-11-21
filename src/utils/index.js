import { IVA_PERCENTAJE } from "@/constants";

export function formatearNumero(valor) {
  // Convertir a número si es una cadena
  var numero = parseFloat(valor);

  // Verificar si el valor es un número válido
  if (!isNaN(numero)) {
    // Usar toFixed(2) para asegurarse de tener dos decimales
    var numeroFormateado = numero.toFixed(2);

    // Reemplazar las comas por puntos
    numeroFormateado = numeroFormateado.replace(",", ".");

    return numeroFormateado;
  } else {
    // Si no es un número válido, devolver el valor original
    return valor;
  }
}

export const roundPrice = (price) => {
  return Math.round(price * 100) / 100;
};

export const calculateIva = (subtotal, discount) => {
  return roundPrice((subtotal - discount) * IVA_PERCENTAJE);
};