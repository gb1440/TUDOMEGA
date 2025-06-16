
import ContractForm from "@/components/ContractForm";
import { Link } from "react-router-dom";
import { useSession } from "@/hooks/use-session";
import LogoutButton from "@/components/LogoutButton";

const Index = () => {
  const { session, loading } = useSession();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="bg-white/95 rounded-3xl shadow-xl p-10 max-w-2xl w-full border flex flex-col gap-8 animate-fade-in">
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">
            Formulário de Contrato
          </h1>
          <p className="text-muted-foreground font-medium">
            Preencha todos os campos para gerar o contrato em PDF.
          </p>
        </div>
        <div className="flex justify-end">
          {!loading && session ? (
            <LogoutButton />
          ) : (
            <Link
              to="/auth"
              className="text-blue-900 underline font-semibold hover:text-blue-700 transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
        <ContractForm />
      </div>
    </main>
  );
};

export default Index;
