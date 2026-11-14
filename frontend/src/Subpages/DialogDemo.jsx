import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import DatePickerInput from "../Charts/DatePickerInput";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
async function fetchCategory() {
  const res = await fetch(`${API_URL}/api/category/`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(res?.message || "Transactions failed");
  }
  const data = await res.json();
  console.log(data);

  return data;
}

async function addTransaction(newPost) {
  const res = await fetch(`${API_URL}/api/transactions/`, {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMessage = data?.message;
    throw new Error(errorMessage);
  }

  return data;
}

export default function DialogDemo() {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [type, setType] = useState("income");
  const [categoryE, setCategoryE] = useState("");
  const [categoryI, setCategoryI] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transaction_date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const {
    data: categorylist = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categorydata"],
    queryFn: fetchCategory,
    enabled: isPageLoaded,
  });
  const { isPending, mutate } = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      toast.success("Transaction Successful");
      setOpen(false);
      setCategoryI("");
      setCategoryE("");
      setAmount("");
      setDescription("");
      setType("income");
      setDate(new Date());
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const activeCategoryName = type === "income" ? categoryI : categoryE;

    if (type && amount && description && transaction_date) {
      const categoria = categorylist.find(
        (item) => item.category_name === activeCategoryName
      ).id;

      const category_id = categoria;

      mutate({ category_id, amount, type, description, transaction_date });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster />
      <DialogTrigger
        render={
          <Button className="bg-[#1F4FD1] rounded-2xl shadow-md cursor-pointer border-0">
            <Plus color="#ffffff" size={18} />
            Add
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-4">
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <Separator />
          <FieldGroup>
            <Field className="pt-4">
              <Tabs defaultValue="income" onValueChange={setType}>
                <TabsList className="w-auto" value={type} onChange={setType}>
                  <TabsTrigger
                    value="income"
                    className="data-[state=active]:!bg-[#1F4FD1] data-[state=active]:!text-white"
                  >
                    Income
                  </TabsTrigger>
                  <TabsTrigger
                    value="expense"
                    className="data-[state=active]:!bg-[#C2262E] data-[state=active]:!text-white"
                  >
                    Expenses
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="income">
                  <Card>
                    <CardDescription>
                      <Field>
                        <Label htmlFor="category" className="text-[#0E1A2B]">
                          Category
                        </Label>
                        <Select
                          items={categorylist}
                          className="w-full"
                          value={categoryI}
                          onValueChange={setCategoryI}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              <SelectItem value="">
                                Select a category
                              </SelectItem>
                              {categorylist.map(
                                (item) =>
                                  item.type === "income" && (
                                    <SelectItem
                                      key={item.id}
                                      value={item.category_name}
                                    >
                                      {item.category_name}
                                    </SelectItem>
                                  )
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    </CardDescription>
                  </Card>
                </TabsContent>
                <TabsContent value="expense">
                  <Card>
                    <CardDescription>
                      <Field>
                        <Label htmlFor="category" className="text-[#0E1A2B]">
                          Category
                        </Label>
                        <Select
                          items={categorylist}
                          className="w-full"
                          value={categoryE}
                          onValueChange={setCategoryE}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              <SelectItem value="">
                                Select a category
                              </SelectItem>
                              {categorylist.map(
                                (item) =>
                                  item.type === "expense" && (
                                    <SelectItem
                                      key={item.id}
                                      value={item.category_name}
                                    >
                                      {item.category_name}
                                    </SelectItem>
                                  )
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    </CardDescription>
                  </Card>
                </TabsContent>
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>
                        Manage your account preferences and options. Customize
                        your experience to fit your needs.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Configure notifications, security, and themes.
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </Field>
            <Field>
              <Label htmlFor="name-1">Amount</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="Amount"
                value={amount}
                onValueChange={setAmount}
              />
            </Field>

            <Field>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description-1"
                name="description"
                placeholder="eg. Coffee at starbucks"
                value={description}
                onValueChange={setDescription}
              />
            </Field>
            <Field>
              <DatePickerInput
                value={transaction_date}
                onValueChange={setDate}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
