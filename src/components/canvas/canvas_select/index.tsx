interface CanvasSelectProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  name?: string;
  option1Label?: string;
  option1Value?: string;
  option2Label?: string;
  option2Value?: string;
  option3Label?: string;
  option3Value?: string;
  option4Label?: string;
  option4Value?: string;
  option5Label?: string;
  option5Value?: string;
  option6Label?: string;
  option6Value?: string;
  option7Label?: string;
  option7Value?: string;
  option8Label?: string;
  option8Value?: string;
}

// Form-field density classes shared across Input, Textarea, Select. Keep
// these strings byte-identical with the matching constants in those files
// — Canvas CLI bans cross-file imports for component sources.
const FIELD_WRAPPER = "space-y-2";
const FIELD_LABEL =
  "text-sm font-medium leading-none text-foreground";
const FIELD_CONTROL =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function CanvasSelect({
  label = "Label",
  placeholder = "Select...",
  required = false,
  helpText,
  name = "select",
  option1Label,
  option1Value,
  option2Label,
  option2Value,
  option3Label,
  option3Value,
  option4Label,
  option4Value,
  option5Label,
  option5Value,
  option6Label,
  option6Value,
  option7Label,
  option7Value,
  option8Label,
  option8Value,
}: CanvasSelectProps) {
  const selectId = `select-${name}`;
  const helpId = helpText ? `${selectId}-help` : undefined;

  const options: { label: string; value: string }[] = [];
  if (option1Label && option1Value) options.push({ label: option1Label, value: option1Value });
  if (option2Label && option2Value) options.push({ label: option2Label, value: option2Value });
  if (option3Label && option3Value) options.push({ label: option3Label, value: option3Value });
  if (option4Label && option4Value) options.push({ label: option4Label, value: option4Value });
  if (option5Label && option5Value) options.push({ label: option5Label, value: option5Value });
  if (option6Label && option6Value) options.push({ label: option6Label, value: option6Value });
  if (option7Label && option7Value) options.push({ label: option7Label, value: option7Value });
  if (option8Label && option8Value) options.push({ label: option8Label, value: option8Value });

  return (
    <div className={FIELD_WRAPPER}>
      <label htmlFor={selectId} className={FIELD_LABEL}>
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </label>
      <select
        id={selectId}
        name={name}
        required={required}
        aria-describedby={helpId}
        defaultValue=""
        className={`${FIELD_CONTROL} h-10`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p id={helpId} className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}
