interface CanvasRadioGroupProps {
  label?: string;
  name?: string;
  required?: boolean;
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
  defaultValue?: string;
}

export default function CanvasRadioGroup({
  label = "Radio Group",
  name = "radio",
  required = false,
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
  defaultValue,
}: CanvasRadioGroupProps) {
  const options: { label: string; value: string }[] = [];
  if (option1Label && option1Value) options.push({ label: option1Label, value: option1Value });
  if (option2Label && option2Value) options.push({ label: option2Label, value: option2Value });
  if (option3Label && option3Value) options.push({ label: option3Label, value: option3Value });
  if (option4Label && option4Value) options.push({ label: option4Label, value: option4Value });
  if (option5Label && option5Value) options.push({ label: option5Label, value: option5Value });

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium leading-none text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </legend>
      <div className="space-y-2">
        {options.map((opt) => {
          const radioId = `${name}-${opt.value}`;
          return (
            <div key={opt.value} className="flex min-h-12 items-center space-x-3">
              <input
                id={radioId}
                type="radio"
                name={name}
                value={opt.value}
                defaultChecked={defaultValue === opt.value}
                required={required}
                className="h-5 w-5 border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <label
                htmlFor={radioId}
                className="text-sm font-medium leading-none text-foreground"
              >
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
