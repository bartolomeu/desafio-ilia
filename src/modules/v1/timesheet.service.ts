import { InjectRepository } from '@nestjs/typeorm';
import { ClockIn } from './entities/clockIn.entity';
import { Between, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Relatorio } from './dto/relatorio.dto';
import { Expediente } from './dto/expediente.dto';

@Injectable()
export class TimeSheetService {
  constructor(
    @InjectRepository(ClockIn)
    private clockInRepository: Repository<ClockIn>,
  ) {}
  async getAllHitsMonth(anoMes: string, profile: string): Promise<Relatorio> {
    const userId = Number(profile);
    const anoMesStart = this.getAnoMesStart(anoMes);
    const anoMesEnd = this.getAnoMesEnd(anoMes);

    const hits = await this.clockInRepository.find({
      where: {
        userId,
        momento: Between(anoMesStart, anoMesEnd),
      },
      order: {
        momento: 'ASC',
      },
    });

    if (hits.length == 0) {
      throw new NotFoundException({
        message: 'Relatório não encontrado',
      });
    }

    const expedientes: Expediente[] = [];
    let expediente: Expediente;
    hits.forEach((elm) => {
      const dtMomento = new Date(elm.momento);
      if (
        expediente == null ||
        expediente.dia != dtMomento.toISOString().split('T')[0]
      ) {
        if (expediente != null) {
          expedientes.push(expediente);
        }
        expediente = {
          dia: dtMomento.toISOString().split('T')[0],
          pontos: [dtMomento.toTimeString().split(' ')[0]],
        };
        return;
      }
      expediente.pontos.push(
        dtMomento.toTimeString().split(' ')[0],
      );
    });
    expedientes.push(expediente);

    //QTDADE DE DIAS UTEIS NO MES?!?
    const WORKING_DAYS = 22;

    //QTDADE DE HORAS/DIA ?!?
    const HOURS_PER_DAY = 8;

    const totalMiliseconds = expedientes.reduce((acc, elm) => {
      if (elm.pontos.length >= 2) {
        acc += this.getDiffTime(elm.pontos[0], elm.pontos[1]);
      }
      if (elm.pontos.length == 4) {
        acc += this.getDiffTime(elm.pontos[2], elm.pontos[3]);
      }
      //dia com 1 ou 3 batida(s) de ponto deve retornar algum erro ?!?
      return acc;
    }, 0);

    const horasTrabalhadas = this.milisecondsToIso8601(totalMiliseconds);
    const diff =
      totalMiliseconds - HOURS_PER_DAY * WORKING_DAYS * 60 * 60 * 1000;
    let horasExcedentes = 'PT0S';
    let horasDevidas = 'PT0S';
    if (diff > 0) {
      horasExcedentes = this.milisecondsToIso8601(diff);
    } else if (diff < 0) {
      horasDevidas = this.milisecondsToIso8601(diff * -1);
    }

    return {
      anoMes,
      horasTrabalhadas,
      horasExcedentes,
      horasDevidas,
      expedientes,
    };
  }
  milisecondsToIso8601(diff: number): string {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);
    return `PT${hours > 0 ? `${hours}H` : ''}${
      minutes > 0 ? `${minutes}M` : ''
    }${seconds}S`;
  }
  getDiffTime(arg0: string, arg1: string) {
    const d1 = new Date(`2000-01-01T${arg0}Z`);
    const d2 = new Date(`2000-01-01T${arg1}Z`);
    const diff = d2.getTime() - d1.getTime();
    return diff;
  }
  getAnoMesEnd(anoMes: string) {
    // '2024-01' => entrada
    // '2024-01-31 23:59:59' => saida
    let [ano, mes] = anoMes.split('-').map((elm) => Number(elm));
    if(mes == 12){
      ano ++;
      mes = 1;
    }else{
      mes ++;
    }
    const dt = new Date(`${ano}-${mes}-01 23:59:59 UTC`);
    dt.setUTCDate(0);
    return dt.toISOString();
    // return `${dt.getUTCFullYear()}-${dt.getUTCMonth() + 1}-${dt.getUTCDate()} 23:59:59`;
  }
  getAnoMesStart(anoMes: string) {
    return `${anoMes}-01 00:00:00`;
  }
}
