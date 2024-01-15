import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Batida } from './dto/batida.dto';
import { Expediente } from './dto/expediente.dto';
import { Erro } from './dto/erro.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ClockInService } from './clockIn.service';

@Controller('batidas')
export class ClockInController {
  constructor(private clockInService: ClockInService) {}

  @Post()
  @ApiOperation({
    summary: 'Bater ponto',
    description: 'Registrar um horário da jornada diária de trabalho',
    tags: ['Batidas'],
  })
  @ApiBody({ type: Batida })
  @ApiResponse({ status: 201, description: 'Created', type: Expediente })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: Erro,
    schema: {
      examples: {
        Almoço: { value: { mensagem: 'Horário inválido' } },
        'Campo Obrigatório': {
          value: { mensagem: 'Campo obrigatório não informado' },
        },
        'Formato Inválido': {
          value: { mensagem: 'Data e hora em formato inválido' },
        },
        '4 Horários': {
          value: {
            mensagem: 'Apenas 4 horários podem ser registrados por dia',
          },
          'Sábado e domingo': {
            value: {
              mensagem:
                'Sábado e domingo não são permitidos como dia de trabalho',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: Erro,
    schema: {
      examples: {
        'Horário já registrado': {
          value: { mensagem: 'Horário já registrado' },
        },
      },
    },
  })
  @ApiHeader({ name: 'profile', required: true, schema: { type: 'number' } })
  @UseGuards(AuthGuard)
  async postClockIn(@Body() data: Batida, @Request() req): Promise<Expediente> {
    return await this.clockInService.postClockIn(data, req.headers['profile']);
  }
}
