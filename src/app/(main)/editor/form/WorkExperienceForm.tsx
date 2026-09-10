import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { workExperienceSchema, WorkExperienceValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, UseFormReturn } from "react-hook-form";

export default function WorkExperienceForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: resumeData.workExperiences || [],
    },
  });

  useEffect(() => {
    const subscribtion = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }
      setResumeData({
        ...resumeData,
        workExperiences:
          values.workExperiences?.filter((exp) => exp !== undefined) || [],
      });
    });
    return () => subscribtion.unsubscribe();
  }, [form, resumeData, setResumeData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work experience</CardTitle>
        <CardDescription>
          Add as many work experiences as you like.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
        {fields.map((field, index) => (
          <WorkExperienceItem
            key={field.id}
            form={form}
            id={field.id}
            index={index}
            remove={remove}
          />
        ))}
        </div>
        <Button
          type="button"
          className={"bg-zinc-800"}
          onClick={() =>
            append({
              position: "",
              company: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
        >
          Add Work Experience
        </Button>
      </CardContent>
    </Card>
  );
}

interface WorkExperienceItemProps {
  form: UseFormReturn<WorkExperienceValues>;
  id: string;
  index: number;
  remove: (index: number) => void;
}

export function WorkExperienceItem({
  form,
  index,
  remove,
}: WorkExperienceItemProps) {
  return (
    <div className="space-y-4 rounded-md border border-gray-600 bg-background p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">Work experience {index + 1}</span>
        <GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none" />
      </div>

      {/* JOB TITLE */}
      <Controller
        name={`workExperiences.${index}.position`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Job title</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              autoFocus
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* COMPANY */}
      <Controller
        name={`workExperiences.${index}.company`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Company</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* DATES */}
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name={`workExperiences.${index}.startDate`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Start date</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="date"
                value={field.value?.slice(0, 10) || ""}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name={`workExperiences.${index}.endDate`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>End date</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="date"
                value={field.value?.slice(0, 10) || ""}
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                Leave <span className="font-semibold">end date</span> empty if
                you are currently working here.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* DESCRIPTION */}
      <Controller
        name={`workExperiences.${index}.description`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Description</FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* FOOTER ACTIONS */}
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  );
}
