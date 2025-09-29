export interface NoteMeta {
  id: string;
  title: string;
}

export interface Note extends NoteMeta {
  content: string;
}

export interface Language {
  value: string,
  label: string,
  fileExtension: string
}