import {Language} from "@/types/note";

export enum NoteType {
  normal = 'normal',
  code = 'code',
}

export const LANGUAGES : Record<string, Language> = {
  javascript: { value: "javascript", label: "JavaScript" },
  javascript_jsx: { value: "javascript_jsx", label: "JavaScript (JSX)" },
  typescript: { value: "typescript", label: "TypeScript" },
  typescript_jsx: { value: "typescript_jsx", label: "TypeScript (TSX)" },
  python: { value: "python", label: "Python" },
  java: { value: "java", label: "Java" },
  csharp: { value: "csharp", label: "C#" }
}