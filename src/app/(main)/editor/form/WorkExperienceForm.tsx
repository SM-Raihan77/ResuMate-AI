import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditorFormProps } from "@/lib/types";
import { workExperienceSchema, WorkExperienceValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

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

  const { fields, append } = useFieldArray({
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
        {fields.map((field) => (
          <WorkExperienceItem key={field.id} />
        ))}
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

function WorkExperienceItem() {
  return <div>Work experience</div>;
}
