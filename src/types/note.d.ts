export interface NoteMeta {
  id: string,
  title: string,
}

export interface Note extends NoteMeta {
  content: string,
}