interface CanvasTextProps {
  text?: string;
}

export default function CanvasText({
  text = "",
}: CanvasTextProps) {
  if (!text) return null;

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
