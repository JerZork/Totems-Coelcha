const generatePrintableContent = (clientDetails, selectedDebts, total) => {
    const printWindow = window.open('', '_blank');
    const printDate = new Date().toLocaleDateString('es-ES');

    const content = `
      <html>
        <head>
          <title>Comprobante de Pago</title>
          <style>
            @media print {
                // Dentro del estilo en generatePrintableContent, agregar:
                  button, input, .no-print {
                    display: none !important;
                }
                
                .print-section {
                    display: block !important;
                }
                
                table {
                    page-break-inside: avoid;
                }
                
                .total {
                    font-size: 14px;
                }
                }

              body {
                width: 80mm;
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
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logo}" class="logo" alt="Logo">
            <h2>COELCHA S.A.</h2>
            <p>NIT: 890.111.265-3</p>
            <p>${printDate}</p>
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
              <td>Servicio:</td>
              <td>${clientDetails.NUMERO_SERVICIO}</td>
            </tr>
          </table>
  
          <div class="divider"></div>
  
          <table>
            <tr>
              <th align="left">Fecha</th>
              <th align="right">Valor</th>
            </tr>
            ${selectedDebts.map(debt => `
              <tr>
                <td>${format(new Date(debt.FECHA_MOVIMIENTO), "MMM/yyyy", { locale: es })}</td>
                <td align="right">$${parseFloat(debt.SALDO).toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
  
          <div class="divider"></div>
  
          <table>
            <tr>
              <td><strong>TOTAL:</strong></td>
              <td align="right"><strong>$${total.toLocaleString()}</strong></td>
            </tr>
          </table>
  
          <p style="text-align: center; margin-top: 5mm;">Gracias por su pago!</p>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();

    return printWindow;
};