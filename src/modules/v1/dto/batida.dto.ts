import { ApiProperty } from '@nestjs/swagger';

export class Batida {
  @ApiProperty({
    example: '2018-08-22T08:00:00',
    description: 'Momento da batida',
    type: 'string',
  })
  readonly momento: string;
}
