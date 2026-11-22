"use client";

import { TechIcon, originalNames } from "@/components/tech-icon";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { snippetKinds } from "@cue/shared";
import { snippetSchema, SnippetSchema } from "@cue/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import z from "zod";
import { formatSnippetKind } from "../lib/formatters";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { createSnippetAction, updateSnippetAction } from "../actions/actions";
import { SnippetSelectData } from "@/db/schema";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

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
          technology: "",
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
              <Textarea
                id="snippet-body"
                placeholder="Snippet/prompt goes here..."
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
        name="kind"
        render={({ field: { onChange, ...props }, fieldState }) => {
          const { label, icon: Icon } = formatSnippetKind(props.value);
          return (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="snippet-kind">Kind</FieldLabel>
              <FieldContent>
                <Select onValueChange={onChange} {...props}>
                  <SelectTrigger
                    id="snippet-kind"
                    aria-invalid={!!fieldState.error}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select a kind">
                      <Icon />
                      <span>{label}</span>
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
        name="technology"
        render={({ field: { value, onChange, ...props }, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor="snippet-technology">Technology</FieldLabel>
            <FieldContent>
              <Combobox
                items={originalNames}
                autoHighlight
                value={value}
                onValueChange={onChange}
                {...props}
              >
                <ComboboxInput
                  id="snippet-technology"
                  placeholder="Search technologies…"
                  aria-invalid={!!fieldState.error}
                  className="w-full flex-1"
                >
                  <InputGroupAddon className="mr-1">
                    <TechIcon size={24} name={value ?? ""} />
                  </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        <div className="flex items-center gap-2">
                          <TechIcon size={24} name={item} />
                          <span>{item}</span>
                        </div>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
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
                    {fields.map((field) => (
                      <Badge variant="outline" key={field.id}>
                        {field.name}
                      </Badge>
                    ))}
                  </div>
                )}
                <InputGroupInput
                  id="snippet-tags"
                  placeholder={fields.length > 0 ? "" : "Enter a tag"}
                  aria-invalid={!!fieldState.error}
                  value={currentTagValue}
                  onChange={(e) => setCurrentTagValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (currentTagValue.trim() && e.key === "Enter") {
                      e.preventDefault();
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
