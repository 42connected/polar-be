import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Categories } from './categories.entity';
import { Keywords } from './keywords.entity';

@Entity()
export class KeywordCategories {
  @PrimaryColumn('uuid', { name: 'category_id' })
  categoryId: string;

  @PrimaryColumn('uuid', { name: 'keyword_id' })
  keywordId: string;

  @ManyToOne(() => Keywords, Keywords => Keywords.id)
  @JoinColumn({ name: 'keyword_id' })
  keywords: Keywords;

  @ManyToOne(() => Categories, Categories => Categories.id)
  @JoinColumn({ name: 'category_id' })
  categories: Categories;
}
