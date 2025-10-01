import {Language} from "@/types/note";

export enum NoteType {
  normal = 'normal',
  code = 'code',
}

export const LANGUAGES : Record<string, Language> = {
  javascript: { value: "JAVASCRIPT", label: "JavaScript",  fileExtension: "js" },
  javascript_jsx: { value: "JAVASCRIPT_JSX", label: "JavaScript (JSX)", fileExtension: "jsx" },
  typescript: { value: "TYPESCRIPT", label: "TypeScript", fileExtension: "ts" },
  typescript_jsx: { value: "TYPESCRIPT_JSX", label: "TypeScript (TSX)", fileExtension: "tsx" },
  python: { value: "PYTHON", label: "Python", fileExtension: "py" },
  java: { value: "JAVA", label: "Java", fileExtension: "java" },
  csharp: { value: "CSHARP", label: "C#", fileExtension: "cs" },
}