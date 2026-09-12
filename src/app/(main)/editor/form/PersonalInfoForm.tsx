import { personalInfoSchema, PersonalInfoValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { EditorFormProps } from "@/lib/types";

export default function PersonalInfoForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      jobTitle: resumeData.jobTitle || "",
      city: resumeData.city || "",
      country: resumeData.country || "",
      phone: resumeData.phone || "",
      email: resumeData.email || "",
    },
  });
  
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const subscribtion = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }
      setResumeData({ ...resumeData, ...values });
    });
    return () => subscribtion.unsubscribe();
  }, [form, resumeData, setResumeData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal info</CardTitle>
        <CardDescription>Tell us about yourself.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="personal-info">
          <FieldGroup>
            <Controller
              name="photo"
              control={form.control}
              render={({ field: { value, ...fieldValues }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="personal-info-photo">
                    Your photo
                  </FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      {...fieldValues}
                      id="personal-info-photo"
                      type="file"
                      accept="image/*"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                        ref={photoInputRef}
                    />
                    <Button
                      variant="secondary"
                      type="button"
                        onClick={() => {
                          fieldValues.onChange(null);
                          if (photoInputRef.current) {
                            photoInputRef.current.value = "";
                          }
                        }}
                    >
                      Remove
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="personal-info-firstName">
                      First name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="personal-info-firstName"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="personal-info-lastName">
                      Last name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="personal-info-lastName"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="jobTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="personal-info-jobTitle">
                    Job title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="personal-info-jobTitle"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="personal-info-city">City</FieldLabel>
                    <Input
                      {...field}
                      id="personal-info-city"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="personal-info-country">
                      Country
                    </FieldLabel>
                    <Input
                      {...field}
                      id="personal-info-country"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="personal-info-phone">Phone</FieldLabel>
                  <Input
                    {...field}
                    id="personal-info-phone"
                    type="tel"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="personal-info-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="personal-info-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button variant="secondary" form="personal-info">
            Next
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
