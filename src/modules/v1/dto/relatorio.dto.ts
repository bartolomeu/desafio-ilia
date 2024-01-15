import { ApiProperty } from '@nestjs/swagger';
import { Expediente } from './expediente.dto';

export class Relatorio {
  @ApiProperty({
    example: '2018-08',
    format: 'ISO 8601.Duration',
    type: 'string',
  })
  readonly anoMes: string;

  @ApiProperty({
    example: 'PT69H35M5S',
    format: 'ISO 8601.Duration',
    type: 'string',
  })
  readonly horasTrabalhadas: string;

  @ApiProperty({
    example: 'PT25M5S',
    format: 'ISO 8601.Duration',
    type: 'string',
  })
  readonly horasExcedentes: string;

  @ApiProperty({
    example: 'PT0S',
    format: 'ISO 8601.Duration',
    type: 'string',
  })
  readonly horasDevidas: string;

  @ApiProperty()
  readonly expedientes: Expediente[];
}
