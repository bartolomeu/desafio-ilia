import { Module } from '@nestjs/common';
import { ClockInController } from './clockIn.controller';
import { TimeSheetController } from './timeSheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClockIn } from './entities/clockIn.entity';
import { ClockInService } from './clockIn.service';
import { TimeSheetService } from './timesheet.service';

@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([ClockIn]),
  ],
  controllers: [ClockInController, TimeSheetController],
  providers: [ClockInService, TimeSheetService],
})
export class V1Module {}
