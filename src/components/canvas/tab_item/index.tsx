import { type ReactNode } from "react";

interface TabItemProps {
  label?: string;
  content?: ReactNode;
}

export default function TabItem({ content }: TabItemProps) {
  return <>{content}</>;
}
