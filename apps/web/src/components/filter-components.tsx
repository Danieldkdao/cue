import { cn } from "cn";
import { ReactNode } from "react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "./ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const FilterLabel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn("text-base font-medium", className)}>{children}</span>
  );
};

export const SelectFilter = <V extends string>({
  value,
  onValueChange,
  format,
  options,
  styleOptions = {},
}: {
  value: V;
  onValueChange: (value: V | null) => void;
  format: (value: V) => ReactNode;
  options: readonly V[];
  styleOptions?: { triggerClassName?: string; placeholder?: string };
}) => {
  const { triggerClassName, placeholder } = styleOptions;
  const valueElement = format(value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder}>{valueElement}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {format(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const MultiSelectFilter = <V extends string>({
  values,
  onValuesChange,
  format,
  options,
  styleOptions = {},
}: {
  values: V[];
  onValuesChange: (values: V[]) => void;
  format: (value: V) => ReactNode;
  options: readonly V[];
  styleOptions?: { triggerClassName?: string; placeholder?: string };
}) => {
  const { triggerClassName, placeholder } = styleOptions;

  return (
    <MultiSelect
      values={values}
      onValuesChange={(values) => onValuesChange(values as V[])}
    >
      <MultiSelectTrigger className={cn("w-full", triggerClassName)}>
        <MultiSelectValue placeholder={placeholder} />
      </MultiSelectTrigger>
      <MultiSelectContent>
        {options.map((option) => (
          <MultiSelectItem key={option} value={option}>
            {format(option)}
          </MultiSelectItem>
        ))}
      </MultiSelectContent>
    </MultiSelect>
  );
};
