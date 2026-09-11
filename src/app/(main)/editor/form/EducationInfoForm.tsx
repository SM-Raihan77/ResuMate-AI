import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { educationSchema, EducationValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";

export default function EducationInfoForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations || [],
    },
  });

  useEffect(() => {
    const subscription = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }
      setResumeData({
        ...resumeData,
        educations: values.educations?.filter((edu) => edu !== undefined) || [],
      });
    });
    return () => subscription.unsubscribe();
  }, [form, resumeData, setResumeData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>
          Add as many education entries as you like.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <EducationItem
              key={field.id}
              id={field.id}
              form={form}
              index={index}
              remove={remove}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            append({
              degree: "",
              school: "",
              startDate: "",
              endDate: "",
            })
          }
        >
          Add education
        </Button>
      </CardContent>
    </Card>
  );
}

interface EducationItemProps {
  id: string;
  form: UseFormReturn<EducationValues>;
  index: number;
  remove: (index: number) => void;
}

export function EducationItem({ form, index, remove }: EducationItemProps) {
  return (
    <div className="space-y-4 rounded-md border border-gray-600 bg-background p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">Education {index + 1}</span>
        <GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none" />
      </div>

      {/* DEGREE / PROGRAM */}
      <Controller
        name={`educations.${index}.degree`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Degree</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="e.g. Bachelor of Science in Computer Science"
              autoFocus
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* SCHOOL / INSTITUTION */}
      <Controller
        name={`educations.${index}.school`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>School / University</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="e.g. University of Oxford"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* DATES */}
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name={`educations.${index}.startDate`}
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
          name={`educations.${index}.endDate`}
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
                you are currently studying here.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {/* FOOTER ACTIONS */}
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  );
}
