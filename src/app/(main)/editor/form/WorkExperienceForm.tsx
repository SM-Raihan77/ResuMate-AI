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
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { workExperienceSchema, WorkExperienceValues } from "@/lib/validations";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";

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
    const subscription = form.watch(async (values) => {
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
    return () => subscription.unsubscribe();
  }, [form, resumeData, setResumeData]);

  // 1. Destructure 'move' from useFieldArray
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  // 2. Configure sensors to require a 5px drag distance before activating.
  // This ensures clicking on the drag handle or inputs doesn't accidentally trigger a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 3. Handle the drop event
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      // Tell React Hook Form to swap the items internally
      move(oldIndex, newIndex);
    }
  }

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
          {/* 4. Wrap your list in DndContext and SortableContext */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <WorkExperienceItem
                  key={field.id}
                  id={field.id}
                  form={form}
                  index={index}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <Button
          type="button"
          variant={"secondary"}
          className="mt-4"
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
  id,
  index,
  remove,
}: WorkExperienceItemProps) {
  // 5. Initialize the sortable hook for this specific item
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // 6. Generate the CSS transform style
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-4 rounded-md border border-gray-600 bg-background p-4"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold">Work experience {index + 1}</span>
        {/* 7. Attach listeners and attributes ONLY to the grip handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab focus:outline-none"
        >
          <GripHorizontal className="size-5 text-muted-foreground" />
        </div>
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
