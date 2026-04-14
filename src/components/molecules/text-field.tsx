import type { ReactNode } from "react";

import { FieldMessage } from "@/components/atoms/field-message";
import { Input, type InputProps } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";

interface TextFieldProps extends Omit<InputProps, "error"> {
  error?: string;
  helperText?: ReactNode;
  label: string;
  rightSlot?: ReactNode;
}

export function TextField({
  error,
  helperText,
  id,
  label,
  rightSlot,
  ...props
}: TextFieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {rightSlot}
      </div>
      <Input error={Boolean(error)} id={id} {...props} />
      {error ? (
        <FieldMessage role="alert" variant="error">
          {error}
        </FieldMessage>
      ) : helperText ? (
        <FieldMessage>{helperText}</FieldMessage>
      ) : null}
    </div>
  );
}
