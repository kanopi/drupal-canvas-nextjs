interface CanvasCheckboxProps {
  label?: string;
  description?: string;
  defaultChecked?: boolean;
  name?: string;
}

export default function CanvasCheckbox({
  label = "Checkbox",
  description,
  defaultChecked = false,
  name = "checkbox",
}: CanvasCheckboxProps) {
  const checkboxId = `checkbox-${name}`;

  return (
    <div className="flex min-h-12 items-center space-x-3">
      <input
        id={checkboxId}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-5 w-5 rounded border-input text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
      <div className="space-y-1">
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium leading-none text-foreground"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
