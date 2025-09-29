import {Language} from "@/types/note";

export enum NoteType {
  normal = 'normal',
  code = 'code',
}

export const LANGUAGES : Record<string, Language> = {
  javascript: { value: "javascript", label: "JavaScript",  fileExtension: "js" },
  javascript_jsx: { value: "javascript_jsx", label: "JavaScript (JSX)", fileExtension: "jsx" },
  typescript: { value: "typescript", label: "TypeScript", fileExtension: "ts" },
  typescript_jsx: { value: "typescript_jsx", label: "TypeScript (TSX)", fileExtension: "tsx" },
  python: { value: "python", label: "Python", fileExtension: "py" },
  java: { value: "java", label: "Java", fileExtension: "java" },
  csharp: { value: "csharp", label: "C#", fileExtension: "cs" },
}