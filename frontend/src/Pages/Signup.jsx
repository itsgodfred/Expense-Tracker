import { React, useState, useContext } from "react";
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
import { navContext } from "../App";

async function signUser(newPost) {
  const API_URL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(newPost),
    credentials: "include",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    const errorMessage = data?.message;
    throw new Error(errorMessage);
  }
  console.log(data.message);
  return data;
}

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login, setLogin } = useContext(navContext);
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signUser,
    onSuccess: () => {
      setLogin(true);
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e) => {
    if (email && password && name) {
      mutate({ name, email, password });
    }
    e.preventDefault();
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
                Create Account
              </CardTitle>
              <CardDescription>
                Join us today by entering details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit} id="signup-form">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Full name"
                      className="bg-white"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      required
                    />
                  </div>
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
                className="w-full bg-[#1F4FD1] "
                disabled={isPending}
                form="signup-form"
                onClick={handleSubmit}
              >
                {isPending ? "Signing up..." : "Sign up"}
              </Button>
              <div className="flex items-center">
                <CardDescription>Already have an account?</CardDescription>
                <CardAction>
                  <Button variant="link" className="text-[#1F4FD1]">
                    <Link to="/Login">Login</Link>
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

export default Signup;
