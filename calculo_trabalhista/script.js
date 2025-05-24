document.getElementById("calcForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const valorHora = parseFloat(document.getElementById("valorHora").value);
  if (valorHora === 0) {
    document.getElementById("resultado").innerHTML = "<strong>Encerrado.</strong>";
    return;
  }

  const horas = parseFloat(document.getElementById("horasTrabalhadas").value);
  const vt = document.getElementById("valeTransporte").value;
  const outras = parseFloat(document.getElementById("outrasDeducoes").value) || 0;

  const bruto = valorHora * horas;

  // INSS progressivo
  let inss = 0;
  const faixasINSS = [
    { limite: 1320.00, aliquota: 0.075 },
    { limite: 2571.29, aliquota: 0.09 },
    { limite: 3856.94, aliquota: 0.12 },
    { limite: 7507.49, aliquota: 0.14 }
  ];

  let salarioRestante = bruto;
  let faixaInicio = 0;
  for (let i = 0; i < faixasINSS.length; i++) {
    const faixa = faixasINSS[i];
    if (bruto > faixa.limite) {
      inss += (faixa.limite - faixaInicio) * faixa.aliquota;
      faixaInicio = faixa.limite;
    } else {
      inss += (bruto - faixaInicio) * faixa.aliquota;
      break;
    }
  }

  // IRPF
  const baseIR = bruto - inss;
  let irpf = 0;
  if (baseIR > 4664.68) irpf = baseIR * 0.275 - 884.96;
  else if (baseIR > 3751.06) irpf = baseIR * 0.225 - 651.73;
  else if (baseIR > 2826.65) irpf = baseIR * 0.15 - 370.40;
  else if (baseIR > 2112.00) irpf = baseIR * 0.075 - 158.40;

  // Vale-transporte
  const vtDesconto = vt === "S" ? bruto * 0.06 : 0;

  // Total
  const liquido = bruto - inss - irpf - vtDesconto - outras;

  document.getElementById("resultado").innerHTML = `
    <strong>Salário Bruto:</strong> R$ ${bruto.toFixed(2)}<br>
    <strong>Desconto INSS:</strong> R$ ${inss.toFixed(2)}<br>
    <strong>Desconto IRPF:</strong> R$ ${irpf.toFixed(2)}<br>
    <strong>Desconto VT:</strong> R$ ${vtDesconto.toFixed(2)}<br>
    <strong>Outras Deduções:</strong> R$ ${outras.toFixed(2)}<br><br>
    <strong>Salário Líquido:</strong> R$ ${liquido.toFixed(2)}
  `;
});
