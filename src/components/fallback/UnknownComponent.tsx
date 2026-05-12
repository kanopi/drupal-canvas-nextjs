interface UnknownComponentProps {
  componentId: string;
  [key: string]: unknown;
}

export function UnknownComponent({ componentId, ...props }: UnknownComponentProps) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="border-2 border-dashed border-amber-400 bg-amber-50 p-4 rounded my-2">
      <p className="text-sm font-mono text-amber-800">
        Unknown component: <strong>{componentId}</strong>
      </p>
      {Object.keys(props).length > 0 && (
        <details className="mt-2">
          <summary className="text-xs text-amber-600 cursor-pointer">
            Props
          </summary>
          <pre className="text-xs mt-1 overflow-auto">
            {JSON.stringify(props, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
