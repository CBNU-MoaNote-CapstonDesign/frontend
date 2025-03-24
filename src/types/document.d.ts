export interface MoaTextMeta {
  uuid: string,
  title: string,
}

export interface MoaText extends MoaTextMeta {
  content: string,
}