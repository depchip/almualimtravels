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
import type { TravelPackage } from "@/lib/packages";

const bookingSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  fatherName: z.string().min(2, "Please enter father name."),
  cnic: z.string().optional(),
  category: z.string().min(1, "Please select a category."),
  email: z.string().email("Please enter a valid email.").or(z.literal("")),
  phone: z.string().min(7, "Please enter a valid phone number."),
  service: z.string().min(1, "Please select a service."),
  message: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

export function BookingForm({ pkg }: { pkg: TravelPackage }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      category: pkg.bookingCategories[0],
      service: pkg.type,
      message: `I want to book the ${pkg.title} (${pkg.duration}).`,
      email: "",
    },
  });

  const onSubmit = async (values: BookingValues) => {
    setStatus("idle");

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inquiryType: "package-booking",
        packageId: pkg.id,
        packageName: pkg.title,
        ...values,
      }),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    reset({
      category: pkg.bookingCategories[0],
      service: pkg.type,
      message: `I want to book the ${pkg.title} (${pkg.duration}).`,
      email: "",
      name: "",
      fatherName: "",
      cnic: "",
      phone: "",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mesh-panel gold-ring rounded-[2rem] border-4 border-black p-6 sm:p-8">
      <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Book Your Consultation</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Name (required)</label>
          <Input placeholder="Enter your name" {...register("name")} />
          {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Father Name (required)</label>
          <Input placeholder="Enter father name" {...register("fatherName")} />
          {errors.fatherName ? <p className="mt-2 text-sm text-red-600">{errors.fatherName.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">CNIC (optional)</label>
          <Input placeholder="Enter CNIC (optional)" {...register("cnic")} />
          {errors.cnic ? <p className="mt-2 text-sm text-red-600">{errors.cnic.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Category (required)</label>
          <Select {...register("category")}>
            {pkg.bookingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          {errors.category ? <p className="mt-2 text-sm text-red-600">{errors.category.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Email (optional)</label>
          <Input type="email" placeholder="Enter email (optional)" {...register("email")} />
          {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Phone (required)</label>
          <Input placeholder="Enter phone number" {...register("phone")} />
          {errors.phone ? <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p> : null}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-foreground">Service (required)</label>
          <Select {...register("service")}>
            <option value="Hajj">Hajj Packages</option>
            <option value="Umrah">Umrah Packages</option>
            <option value="International Tour">International Tours</option>
            <option value="Domestic Tour">Domestic Packages</option>
          </Select>
          {errors.service ? <p className="mt-2 text-sm text-red-600">{errors.service.message}</p> : null}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-foreground">Message (optional)</label>
          <Textarea placeholder="Your message (optional)" {...register("message")} />
          {errors.message ? <p className="mt-2 text-sm text-red-600">{errors.message.message}</p> : null}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <SendHorizonal className="mr-2 h-4 w-4" />}
          Book Now
        </Button>
        {status === "success" ? <p className="text-sm text-primary">Your booking inquiry has been submitted.</p> : null}
        {status === "error" ? <p className="text-sm text-red-600">Something went wrong. Please try again.</p> : null}
      </div>
    </form>
  );
}
