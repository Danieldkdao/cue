"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { SnippetSelectData } from "@/db/schema";
import { snippetKinds } from "@cue/shared";
import { snippetSchema } from "@cue/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import z from "zod";
import { createSnippetAction, updateSnippetAction } from "../actions/actions";
import { formatSnippetKind } from "../lib/formatters";

const formSnippetSchema = snippetSchema.extend({
  tags: z.array(z.object({ name: z.string().min(1) })),
});
type FormSnippetSchema = z.infer<typeof formSnippetSchema>;

export const SnippetForm = ({
  existingSnippet,
  afterAction,
}: {
  existingSnippet?: SnippetSelectData;
  afterAction?: () => void;
}) => {
  const router = useRouter();
  const [currentTagValue, setCurrentTagValue] = useState("");
  const form = useForm<FormSnippetSchema>({
    resolver: zodResolver(formSnippetSchema),
    defaultValues: existingSnippet
      ? {
          ...existingSnippet,
          tags: existingSnippet.tags.map((tag) => ({ name: tag })),
        }
      : {
          name: "",
          body: "",
          kind: "code",
          language: "",
          useCase: "",
          tags: [],
          pinned: false,
        },
  });

  const { isSubmitting } = useFormState({
    control: form.control,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const handleSubmit = async (data: FormSnippetSchema) => {
    const parsedData = {
      ...data,
      tags: data.tags.map((tag) => tag.name),
    };
    const action = existingSnippet
      ? updateSnippetAction(existingSnippet.id, parsedData)
      : createSnippetAction(parsedData);
    const response = await action;
    toast.add({
      type: response.error ? "error" : "success",
      title: response.message,
    });
    if (!response.error) {
      router.refresh();
      afterAction?.();
    }
  };

  const kindValue = form.watch("kind");

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="w-full flex flex-col gap-4"
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="snippet-name">Name</FieldLabel>
            <FieldContent>
              <Input
                id="snippet-name"
                placeholder="My Snippet"
                aria-invalid={!!fieldState.error}
                {...field}
              />
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="body"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="snippet-body">Body</FieldLabel>
            <FieldContent>
              <InputGroup>
                {kindValue === "code" && (
                  <Controller
                    control={form.control}
                    name="language"
                    render={({ field: { value, ...props }, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <InputGroup className="border-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 shadow-none">
                          <InputGroupAddon>```</InputGroupAddon>
                          <InputGroupInput
                            placeholder="Enter language here..."
                            className="shadow-none focus-visible:ring-0 border-none!"
                            aria-invalid={!!fieldState.error}
                            value={value ?? ""}
                            {...props}
                          />
                        </InputGroup>
                      </Field>
                    )}
                  />
                )}
                <InputGroupTextarea
                  id="snippet-body"
                  placeholder="Snippet/prompt goes here..."
                  aria-invalid={!!fieldState.error}
                  className="scrollbar-none"
                  {...field}
                />
                {kindValue === "code" && (
                  <InputGroupAddon align="block-end">```</InputGroupAddon>
                )}
              </InputGroup>
            </FieldContent>
            <FieldDescription>
              Code supports syntax highlighting. Prompt supports markdown.
            </FieldDescription>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="kind"
        render={({ field: { value, onChange }, fieldState }) => {
          const { label, icon: Icon } = formatSnippetKind(value);
          return (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="snippet-kind">Kind</FieldLabel>
              <FieldContent>
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger
                    id="snippet-kind"
                    aria-invalid={!!fieldState.error}
                    className="w-full cursor-pointer"
                  >
                    <SelectValue placeholder="Select a kind">
                      <div className="flex items-center gap-2">
                        <Icon />
                        <span>{label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {snippetKinds.map((kind) => {
                      const { label, icon: Icon } = formatSnippetKind(kind);
                      return (
                        <SelectItem key={kind} value={kind}>
                          <div className="flex items-center gap-2">
                            <Icon />
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          );
        }}
      />
      <Controller
        control={form.control}
        name="useCase"
        render={({ field: { value, ...props }, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="snippet-useCase">Use case</FieldLabel>
            <FieldContent>
              <Textarea
                id="snippet-useCase"
                placeholder="Describe the use cases for this snippet/prompt..."
                aria-invalid={!!fieldState.error}
                value={value ?? ""}
                {...props}
              />
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="pinned"
        render={({ field: { value, onChange, ...props }, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <label
              htmlFor="snippet-pinned"
              className="w-full flex flex-col gap-2 cursor-pointer p-3 bg-input/30 border border-border/75 shadow-xs"
            >
              <div className="w-full flex items-center gap-2 justify-between flex-wrap">
                <FieldLabel>Pinned</FieldLabel>
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                  id="snippet-pinned"
                  {...props}
                />
              </div>
              <p className="text-muted-foreground">
                Pinned snippets appear at the top of all search results and
                lists.
              </p>
            </label>
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="tags"
        render={({ fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="snippet-tags">Tags</FieldLabel>
            <FieldContent>
              <InputGroup>
                {fields.length > 0 && (
                  <div className="flex items-center gap-1 ml-2">
                    {fields.map((field, index) => (
                      <Badge variant="outline" key={field.id}>
                        {field.name}
                        <button
                          className="cursor-pointer"
                          onClick={() => remove(index)}
                        >
                          <XIcon className="size-3 text-destructive" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <InputGroupInput
                  id="snippet-tags"
                  placeholder={fields.length > 0 ? "" : "Enter a tag"}
                  aria-invalid={!!fieldState.error}
                  value={currentTagValue}
                  onChange={(e) => {
                    form.clearErrors("tags");
                    setCurrentTagValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (currentTagValue.trim() && e.key === "Enter") {
                      e.preventDefault();
                      const currentValue = currentTagValue.trim();
                      const existingValue = fields.find(
                        (field) => field.name === currentValue,
                      );
                      if (existingValue) {
                        form.setError("tags", {
                          message: `"${currentValue}" has already been added.`,
                        });
                        return;
                      }
                      append({ name: currentTagValue.trim() });
                      setCurrentTagValue("");
                    }
                    if (
                      fields.length > 0 &&
                      e.key === "Backspace" &&
                      currentTagValue === ""
                    ) {
                      remove(fields.length - 1);
                    }
                  }}
                />
              </InputGroup>
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={isSubmitting}>
        <LoadingSwap isLoading={isSubmitting}>
          {existingSnippet ? "Save changes" : "Create snippet"}
        </LoadingSwap>
      </Button>
    </form>
  );
};
