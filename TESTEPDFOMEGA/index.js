const express = require('express');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// 🟢 Serve arquivos estáticos do frontend (HTML, JS)
app.use(express.static('public'));

// Rota raiz para exibir o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Função para calcular idade
function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
  return idade;
}

// Endpoint de geração de PDF
app.post('/generate-pdf', async (req, res) => {
  const {
    nome, rg, cpf, contato, endereco, cep, bairro, cidade, dataNascimento
  } = req.body;

  const idade = calcularIdade(dataNascimento);
  const existingPdfBytes = fs.readFileSync('./contrato_base.pdf');
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ⚠️ Coordenadas de exemplo — vamos ajustar depois
firstPage.drawText(nome, { x: 84.54, y: 784.27, size: 11, font });
firstPage.drawText(String(idade), { x: 461.14, y: 787, size: 11, font });
firstPage.drawText(rg, { x: 68.50, y: 770.27, size: 11, font });
firstPage.drawText(cpf, { x: 291.85, y: 771.44, size: 11, font });
firstPage.drawText(contato, { x: 100.00, y: 755.78, size: 11, font });
firstPage.drawText(endereco, { x: 260.50, y: 754.48, size: 11, font });
firstPage.drawText(cep, { x: 74.00, y: 740.28, size: 11, font });
firstPage.drawText(bairro, { x: 222.00, y: 740.78, size: 11, font });
firstPage.drawText(cidade, { x: 437.78, y: 740.38, size: 11, font });


  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=contrato-preenchido.pdf');
  res.send(pdfBytes);
});

// Starta servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
