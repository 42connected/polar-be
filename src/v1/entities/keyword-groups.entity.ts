import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Keywords } from './keywords.entity';

@Entity()
export class KeywordGroups {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  name: string;

  @OneToMany(() => Keywords, Keywords => Keywords.id)
  @JoinColumn({ name: 'keyword_id' })
  keywords: Keywords[];
}
