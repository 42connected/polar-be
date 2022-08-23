import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { KeywordCategories } from './keyword-categories.entity';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  name: string;

  @OneToMany(
    () => KeywordCategories,
    keywordCategories => keywordCategories.categories,
  )
  keywordCategories: KeywordCategories[];
}
