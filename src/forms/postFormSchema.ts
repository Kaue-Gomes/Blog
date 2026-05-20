import { z } from 'zod';

const urlSchema = z
  .string()
  .min(1, 'Informe uma URL')
  .refine((s) => {
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'A imagem deve ser uma URL http(s) válida');

export const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Informe um título')
    .max(180, 'Título grande demais'),
  image: urlSchema,
  body: z
    .string()
    .min(10, 'O conteúdo é curto demais')
    .max(100000, 'Conteúdo grande demais'),
  tagsCsv: z.string().trim().min(2, 'Informe pelo menos uma tag'),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export function parseTagsFromCsv(tagsCsv: string): string[] {
  return tagsCsv
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, idx, arr) => arr.indexOf(tag) === idx);
}
