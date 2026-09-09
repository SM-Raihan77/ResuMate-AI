"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type FormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsPending(true);

    try {
      const { error } = await signUp.email({
        name: values.fullName,
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.add({
          type: "error",
          description: `${error?.message}. User couldn't be created!`,
        });

        return;
      }

      router.push("/");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {/* Full Name */}
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor="fullName" className="text-gray-300">
                Full Name
              </FieldLabel>

              <Input
                {...field}
                id="fullName"
                placeholder="John Doe"
                autoComplete="name"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                className="bg-background border-white/10 focus-visible:ring-cyber-yellow/50 h-11"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor="email" className="text-gray-300">
                Email address
              </FieldLabel>

              <Input
                {...field}
                id="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                className="bg-background border-white/10 focus-visible:ring-cyber-yellow/50 h-11"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor="password" className="text-gray-300">
                Password
              </FieldLabel>

              <InputGroup className="h-11 border-white/10 bg-background focus-within:ring-1 focus-within:ring-cyber-yellow/50">
                <InputGroupInput
                  {...field}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  className="bg-transparent border-none focus-visible:ring-0"
                />

                <InputGroupAddon align="inline-end">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-cyber-yellow transition-colors focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeIcon className="w-4 h-4" />
                    ) : (
                      <EyeOffIcon className="w-4 h-4" />
                    )}
                  </button>
                </InputGroupAddon>
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        className="w-full h-11 bg-cyber-yellow hover:bg-cyber-yellow-hover text-black font-semibold text-base transition-all shadow-[0_0_15px_var(--yellow-glow)] hover:shadow-[0_0_25px_var(--yellow-glow)]"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Sign Up"
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
