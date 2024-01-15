import { ApiProperty } from '@nestjs/swagger';

export class Erro {
  @ApiProperty()
  readonly mensagem: string;
}
