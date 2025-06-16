
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

const AuthPage = () => {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  React.useEffect(() => {
    if (session && !loading) {
      navigate("/");
    }
  }, [session, loading, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);

    try {
      if (isRegister) {
        // Cadastro
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            emailRedirectTo: window.location.origin + "/",
          },
        });
        if (error) throw error;
        toast({
          title: "Verifique seu email",
          description: "Enviamos um link para confirmar seu cadastro.",
        });
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) throw error;
        toast({
          title: "Login realizado",
          description: "Você será redirecionado...",
        });
      }
    } catch (err: any) {
      let mensagem = err?.message || "Erro desconhecido";
      if (mensagem.includes("Invalid login credentials")) mensagem = "E-mail ou senha incorretos.";
      if (mensagem.includes("User already registered")) mensagem = "Usuário já cadastrado.";
      toast({
        title: "Erro",
        description: mensagem,
      });
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <Card className="w-full max-w-md shadow-xl border p-2">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-blue-900">
            {isRegister ? "Criar conta" : "Entrar"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleAuth}>
            <Input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              autoComplete="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              disabled={loadingForm}
            />
            <Input
              type="password"
              placeholder="Sua senha"
              value={senha}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              onChange={(e) => setSenha(e.target.value)}
              disabled={loadingForm}
            />
            <Button className="w-full" type="submit" disabled={loadingForm}>
              {isRegister ? "Cadastrar" : "Entrar"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-center text-muted-foreground">
            {isRegister ? (
              <>
                Já possui uma conta?{" "}
                <button
                  className="underline text-blue-900"
                  type="button"
                  onClick={() => setIsRegister(false)}
                  disabled={loadingForm}
                >
                  Entrar
                </button>
              </>
            ) : (
              <>
                Não tem conta?{" "}
                <button
                  className="underline text-blue-900"
                  type="button"
                  onClick={() => setIsRegister(true)}
                  disabled={loadingForm}
                >
                  Cadastre-se
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default AuthPage;
