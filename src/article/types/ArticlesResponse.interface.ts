import { ArticleEntity } from '../article.entity';

export interface ArticlesResponseInterface {
  articles: Omit<ArticleEntity, 'updateTimestamp'>[];
  articlesCount: number;
}
