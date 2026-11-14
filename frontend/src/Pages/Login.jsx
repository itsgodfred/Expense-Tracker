import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { WalletMinimal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

async function loguser(newPost) {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    const errorMessage = data?.message;
    throw new Error(errorMessage);
  }
  return data;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: loguser,
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      mutate({ email, password });
    }
    console.log("handleSubmit triggered successfully!");
  };

  return (
    <div className="grid grid-cols-2 flex-1 w-full text-[#0E1A2B] font-text">
      <div className="px-6 py-4 flex flex-col justify-center items-center max-[900px]:col-span-2">
        <span className="hidden justify-start items-center w-full gap-1 max-[900px]:flex">
          <WalletMinimal size={20} color="#1F4FD1" />
          <p>Expense Tracker</p>
        </span>
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <Card className="font-display [--card-spacing:--spacing(9)] bg-[#F6F8FB] w-full max-w-lg max-[900px]:max-w-2xl py-10 px-4 border-0 shadow-none">
            <CardHeader className="gap-1.5">
              <CardTitle className="font-text text-[20px]">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} id="login-form">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="bg-white"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      className="bg-white"
                      placeholder="Must be at least 6 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      required
                    />
                  </div>
                </div>
              </form>

              {error && (
                <p className="text-red-600 text-[12px] mt-4">{error.message}</p>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-[#1F4FD1]"
                form="login-form"
                disabled={isPending}
                onClick={handleSubmit}
              >
                {isPending ? "Logging in..." : "Log In"}
              </Button>
              <div className="flex items-center">
                <CardDescription>Dont have an account?</CardDescription>
                <CardAction>
                  <Button variant="link" className="text-[#1F4FD1]">
                    <Link to="/Signup">SignUp</Link>
                  </Button>
                </CardAction>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="flex justify-center items-center bg-[#0B2A5B] max-[900px]:hidden">
        <span className="flex justify-start items-center gap-1">
          <WalletMinimal size={30} color="#FFFF" />
          <p className="text-white text-2xl">Expense Tracker</p>
        </span>
      </div>
    </div>
  );
}

export default Login;
