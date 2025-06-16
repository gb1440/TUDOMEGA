import { useState } from "react";

const ContractForm = () => {
  const [form, setForm] = useState({
    nome: "",
    dataNascimento: "",
    rg: "",
    cpf: "",
    contato: "",
    numero: "",
    endereco: "",
    cep: "",
    bairro: "",
    cidade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dados = {
      ...form,
      endereco: `${form.endereco}, ${form.numero}`,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar o PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contrato-preenchido.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Falha ao gerar o PDF");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input name="nome" placeholder="Nome" onChange={handleChange} className="w-full border p-2 rounded" />
      <input type="date" name="dataNascimento" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="rg" placeholder="RG" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="cpf" placeholder="CPF" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="contato" placeholder="Contato" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="numero" placeholder="Número" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="endereco" placeholder="Endereço" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="cep" placeholder="CEP" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="bairro" placeholder="Bairro" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="cidade" placeholder="Cidade" onChange={handleChange} className="w-full border p-2 rounded" />
      
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Gerar PDF
      </button>
    </form>
  );
};

export default ContractForm;
