import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ClockIn } from './entities/clockIn.entity';
import { Batida } from './dto/batida.dto';
import { Expediente } from './dto/expediente.dto';

@Injectable()
export class ClockInService {
  constructor(
    @InjectRepository(ClockIn)
    private clockInRepository: Repository<ClockIn>,
  ) {}

  async postClockIn(data: Batida, userId: number): Promise<Expediente> {
    //validate fields
    validateMomento(data.momento);

    const momentoDate = new Date(data.momento);

    //check duplicate hit
    await this.checkDuplicateHit(data.momento, userId);

    //check day off
    this.checkDayOff(momentoDate);

    // check 4 hits
    await this.check4Hits(momentoDate, userId);

    await this.clockInRepository.insert({
      momento: data.momento,
      userId: userId,
    });
    const dateStr = this.convertToDbDate(data.momento);
    const clockHits = await this.clockInRepository.find({
      where: {
        userId: userId,
        momento: Between(`${dateStr} 00:00:00`, `${dateStr} 23:59:59`),
      },
      order: {
        momento: 'ASC',
      },
    });

    const pontos = clockHits.map(
      (elm) => new Date(elm.momento).toTimeString().split(' ')[0],
    );

    return {
      dia: data.momento.split('T')[0],
      pontos,
    };
  }
  async check4Hits(date: Date, userId: number) {
    const dateStr = `${date.getUTCFullYear()}-${
      date.getUTCMonth() + 1
    }-${date.getUTCDate()}`;
    const hits = await this.clockInRepository.countBy({
      userId: userId,
      momento: Between(`${dateStr} 00:00:00`, `${dateStr} 23:59:59`),
    });
    if (hits >= 4) {
      throw new BadRequestException({
        mensagem: 'Apenas 4 horários podem ser registrados por dia',
      });
    }
  }
  checkDayOff(date: Date) {
    const fordibenDaysOfWeek = [0, 6];
    if (fordibenDaysOfWeek.includes(date.getUTCDay())) {
      throw new BadRequestException({
        mensagem: 'Sábado e domingo não são permitidos como dia de trabalho',
      });
    }
  }
  async checkDuplicateHit(momento: string, userId: number) {
    const hits = await this.clockInRepository.countBy({ userId, momento });
    if (hits > 0) {
      throw new ConflictException({ mensagem: 'Horário ja registrado' });
    }
  }

  //convert date string to database format
  convertToDbDate(dateString: string): string {
    const dt = new Date(dateString);
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  }

  //function to convert date string to ISO 8601.Duration
  convertToISO8601Duration(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const isoDuration = `PT${hours}H${minutes}M${seconds}S`;

    return isoDuration;
  }
}
function validateMomento(momento: string) {
  if (!momento) {
    throw new BadRequestException({
      mensagem: 'Campo obrigatório não informado',
    });
  }
  if (isNaN(Date.parse(momento))) {
    throw new BadRequestException({
      mensagem: 'Data e hora em formato inválido',
    });
  }
}
