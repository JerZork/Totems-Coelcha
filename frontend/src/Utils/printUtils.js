// frontend/src/utils/printUtils.js
import { format } from "date-fns";
import { es } from "date-fns/locale";
import logo from "../assets/LOGO_HORIZONTAL.png";

export const generatePrintableContent = (clientDetails, selectedDebts, total) => {
  const printDate = new Date().toLocaleDateString('es-ES');

  const content = `
    <div id="printableContent">
      <style>
        @media print {
          @page {
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #printableContent, #printableContent * {
            visibility: visible;
          }
          #printableContent {
            position: absolute;
            left: 0;
            top: 0;
            width: 100mm;
            font-family: 'Arial Narrow', sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 2mm;
          }
          .header {
            text-align: center;
            margin-bottom: 3mm;
          }
          .logo {
            max-width: 60mm;
            height: auto;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 3mm 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td {
            padding: 1mm 0;
            vertical-align: top;
          }
          .total {
            font-weight: bold;
            margin-top: 3mm;
          }
          button, input, .no-print {
            display: none !important;
          }
        }
      </style>
      <div class="header">
        <img src="${logo}" class="logo" alt="Logo">
        <h2>COELCHA LTDA.</h2>
        <p>Osvaldo Cruz Muñoz 160, Monte Águila</p>
        <p>${printDate}</p>
        <p>Rut: 80.238.000-3</p>
        <p>FONO: 800 123 995 </p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;600 4500 400 </p>
      </div>
      <div class="divider"></div>
      <table>
        <tr>
          <td colspan="2"><strong>Cliente:</strong></td>
        </tr>
        <tr>
          <td colspan="2">${clientDetails.RAZON_SOCIAL}</td>
        </tr>
        <tr>
          <td>Número de Servicio:</td>
          <td>${clientDetails.NUMERO_SERVICIO}</td>
        </tr>
      </table>
      <div class="divider"></div>
      <table>
        <tr>
          <th align="left">Número de Factura</th>
          <th align="left">Fecha</th>
          <th align="right">Valor</th>
        </tr>
        ${selectedDebts.map(debt => `
          <tr>
            <td align="left">${debt.NUMFACTUR}</td>
            <td>${format(new Date(debt.FECHA_MOVIMIENTO), "MMM/yyyy", { locale: es })}</td>
            <td align="right">$${parseFloat(debt.SALDO).toLocaleString('es-ES')}</td>
          </tr>
        `).join('')}
      </table>
      <div class="divider"></div>
      <table>
        <tr>
          <td><strong>SALDO:</strong></td>
          <td align="right"><strong>$${total.toLocaleString('es-ES')}</strong></td>
        </tr>
      </table>
      <p style="text-align: center; margin-top: 5mm;">Web: www.coelcha.cl</p>
      <p style="text-align: center;">e-mail: coelcha@coelcha.cl</p>
    </div>
  `;

  const printContainer = document.createElement('div');
  printContainer.innerHTML = content;
  document.body.appendChild(printContainer);
  window.print();
  document.body.removeChild(printContainer);
};

export const generatePaymentReceiptContent = (clientDetails, selectedDebts, totalAmount) => {
  const paymentDate = format(new Date(), "dd/MM/yyyy HH:mm", { locale: es });
  const user = JSON.parse(sessionStorage.getItem('user'));
  const content = `
    <div id="paymentReceiptContent">
      <style>
        @media print {
          @page {
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #paymentReceiptContent, #paymentReceiptContent * {
            visibility: visible;
          }
          #paymentReceiptContent {
            position: absolute;
            left: 0;
            top: 0;
            width: 107mm;
            font-family: 'Arial Narrow', sans-serif;
            font-size: 18px;
            margin: 0;
            padding: 5mm;
          }
          .header {
            text-align: center;
            margin-bottom: 5mm;
          }
          .logo {
            max-width: 50mm;
            height: auto;
          }
          .section {
            margin-bottom: 8mm;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 3mm;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 5mm 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td {
            padding: 2px 0;
            vertical-align: top;
          }
          .total-amount {
            font-size: 1.2em;
            font-weight: bold;
            text-align: right;
          }
        }
      </style>
      <div class="header">
        <img src="${logo}" class="logo" alt="Logo">
        <h2>COELCHA LTDA.</h2>
        <p>Osvaldo Cruz Muñoz 160, Monte Águila</p>
      </div>
      <div class="section">
        <h3 class="section-title">Comprobante de pago de Energía Eléctrica</h3>
        <table>
          <tr><td>Centro de Pago:</td><td>${user.Sucursal}</td></tr>
          <tr><td>Nombre de Cliente:</td><td>${clientDetails.RAZON_SOCIAL}</td></tr>
          <tr><td>Dir. Servicio:</td><td>${clientDetails.DIR_NIVEL_AGRUPACION_1_EMPALME}</td></tr>
          <tr><td>Fecha Pago:</td><td>${paymentDate}</td></tr>
          <tr><td>Forma De Pago:</td><td>Tarjeta</td></tr>
        </table>
        <p class="total-amount">Cancelado: $${totalAmount.toLocaleString('es-ES')}</p>
      </div>
      <div class="divider"></div>
      <div class="section">
        <h3 class="section-title">Detalle de Pago</h3>
        <table>
          <thead>
            <tr>
              <th>NºServicio</th>
              <th>NºDocumento</th>
              <th>Cancelado</th>
            </tr>
          </thead>
          <tbody>
            ${selectedDebts.map(debt => `
              <tr>
                <td>${clientDetails.NUMERO_SERVICIO}</td>
                <td>${debt.NUMFACTUR}</td>
                <td>$${parseFloat(debt.SALDO).toLocaleString('es-ES')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="divider"></div>
      <div class="section">
        <p>FONO: 800 123 995 - 600 4500 400</p>
        <p>Web: www.coelcha.cl</p>
        <p>e-mail: coelcha@coelcha.cl</p>
      </div>
    </div>
  `;

  const printContainer = document.createElement('div');
  printContainer.innerHTML = content;
  document.body.appendChild(printContainer);
  window.print();
  document.body.removeChild(printContainer);
};