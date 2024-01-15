import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TimeSheetService } from './timesheet.service';
import { Relatorio } from './dto/relatorio.dto';
import { Erro } from './dto/erro.dto';

@Controller('folhas-de-ponto')
export class TimeSheetController {
  constructor(private timeSheetService: TimeSheetService) {}

  @Get('/:anoMes')
  @ApiOperation({
    summary: 'Relatório mensal',
    description: 'Geração de relatório mensal de usuário.',
    tags: ['Folha de Ponto'],
  })
  @ApiParam({
    name: 'anoMes',
    example: '2018-08',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Relatório mensal',
    type: Relatorio,
  })
  @ApiResponse({
    status: 404,
    description: 'Relatório não encontrado',
    type: Erro,
  })
  @ApiHeader({ name: 'profile', required: true })
  @UseGuards(AuthGuard)
  async getAllHitsMonth(
    @Param('anoMes') anoMes: string,
    @Request() req,
  ): Promise<Relatorio> {
    return await this.timeSheetService.getAllHitsMonth(
      anoMes,
      req.headers['profile'],
    );
  }

  
}
