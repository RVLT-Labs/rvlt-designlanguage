"use client";
import {useState, type FormEvent} from "react";
import {Input, SearchInput} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
export function FormFieldExample() {
 const [error,setError]=useState(""); const [saved,setSaved]=useState(false);
 function submit(e:FormEvent<HTMLFormElement>) {
  e.preventDefault(); const email=e.currentTarget.elements.namedItem("email") as HTMLInputElement;
  if(!email.validity.valid) {setError("Enter a valid crew email.");setSaved(false);email.focus();}
  else {setError("");setSaved(true);}
 }
 return <form noValidate onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
  <div className="space-y-2"><Label htmlFor="email">Crew email (required)</Label>
   <Input id="email" name="email" type="email" required autoComplete="email" aria-invalid={!!error} aria-describedby="email-error" />
   <p id="email-error" role="alert" className="text-t-out">{error}</p></div>
  <div className="space-y-2"><Label htmlFor="gear-search">Search gear</Label><SearchInput id="gear-search" placeholder="Tag or model" /></div>
  <Button type="submit">Save example locally</Button><p role="status">{saved ? "Example validated. No data was sent." : "Local reference form. No server connection."}</p>
 </form>;
}
