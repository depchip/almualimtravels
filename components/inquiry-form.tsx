"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  phone: z.string().min(7, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  serviceType: z.enum(["Hajj", "Umrah", "Tour", "Training"]),
  message: z.string().min(10, "Please share a few details about your inquiry."),
});

type InquiryValues = z.infer<typeof inquirySchema>;

export function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      serviceType: "Umrah",
    },
  });

  const onSubmit = async (values: InquiryValues) => {
    setStatus("idle");

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mesh-panel gold-ring rounded-[2rem] p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Input placeholder="Your full name" {...register("name")} />
          {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <Input placeholder="Phone number" {...register("phone")} />
          {errors.phone ? <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p> : null}
        </div>
        <div>
          <Input type="email" placeholder="Email address" {...register("email")} />
          {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
        </div>
        <div>
          <Select {...register("serviceType")}>
            <option value="Hajj">Hajj</option>
            <option value="Umrah">Umrah</option>
            <option value="Tour">Tour</option>
            <option value="Training">Training</option>
          </Select>
          {errors.serviceType ? <p className="mt-2 text-sm text-red-600">{errors.serviceType.message}</p> : null}
        </div>
      </div>
      <div className="mt-5">
        <Textarea placeholder="Tell us what you are planning and how we can help." {...register("message")} />
        {errors.message ? <p className="mt-2 text-sm text-red-600">{errors.message.message}</p> : null}
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <SendHorizonal className="mr-2 h-4 w-4" />}
          Send Inquiry
        </Button>
        {status === "success" ? <p className="text-sm text-primary">Your inquiry has been saved successfully.</p> : null}
        {status === "error" ? <p className="text-sm text-red-600">Something went wrong. Please try again.</p> : null}
      </div>
    </form>
  );
}
