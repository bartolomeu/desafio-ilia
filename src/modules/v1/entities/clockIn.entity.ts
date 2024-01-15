import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'clock_in'
})
export class ClockIn {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number;

  @Column({ type: 'datetime'})
  momento: string;

  @Column({ name: 'user_id' })
  userId: number;
}