interface CanvasInputProps {
  label?: string;
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "number" | "tel" | "url";
  required?: boolean;
  helpText?: string;
  name?: string;
}

// Form-field density classes shared across Input, Textarea, Select. Keep
// these strings byte-identical with the matching constants in those files
// — Canvas CLI bans cross-file imports for component sources.
const FIELD_WRAPPER = "space-y-2";
const FIELD_LABEL =
  "text-sm font-medium leading-none text-foreground";
const FIELD_CONTROL =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function CanvasInput({
  label = "Label",
  placeholder = "",
  inputType = "text",
  required = false,
  helpText,
  name = "input",
}: CanvasInputProps) {
  const inputId = `input-${name}`;
  const helpId = helpText ? `${inputId}-help` : undefined;

  return (
    <div className={FIELD_WRAPPER}>
      <label htmlFor={inputId} className={FIELD_LABEL}>
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </label>
      <input
        id={inputId}
        type={inputType}
        name={name}
        placeholder={placeholder}
        required={required}
        aria-describedby={helpId}
        className={`${FIELD_CONTROL} h-10`}
      />
      {helpText && (
        <p id={helpId} className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}
