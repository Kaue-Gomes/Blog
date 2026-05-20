import { describe, expect, it } from 'vitest';

import { parseTagsFromCsv } from './forms/postFormSchema';

describe('helpers de formulário puramente client-side', (): void => {
  it('normaliza tags separadas por vírgula sem duplicações nem ruídos', (): void => {
    expect(parseTagsFromCsv(' React , firebase , javascript ')).toEqual([
      'react',
      'firebase',
      'javascript',
    ]);
  });
});
