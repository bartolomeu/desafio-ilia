import { ApiProperty } from '@nestjs/swagger';
/**
 * Jornada diária de trabalho
 * @TODO add description to this class
 */
export class Expediente {
  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  readonly dia: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['08:00:00', '12:00:00', '13:00:00', '18:00:00'],
  })
  readonly pontos: string[];
}
