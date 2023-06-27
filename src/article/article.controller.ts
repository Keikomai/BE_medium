import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Delete,
  Put,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/user/guards/auth.guards';
import { UserEntity } from '@app/user/user.entity';
import { User } from '@app/user/decorates/userDecorators';
import { CreateArticleDto } from './dto/createArticle';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle';
import { ArticlesResponseInterface } from './types/ArticlesResponse.interface';
import { BackendValidationPipe } from '@app/shared/pipes/BackendValidation.pipe';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);

    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articleService.deleteArticle(currentUserId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const newArticle = await this.articleService.updateArticle(
      currentUserId,
      updateArticleDto,
      slug,
    );
    return this.articleService.buildArticleResponse(newArticle);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const newArticle = await this.articleService.addArticleToFavorites(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(newArticle);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async deleteArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const newArticle = await this.articleService.deleteArticleToFavorites(
      currentUserId,
      slug,
    );
    return this.articleService.buildArticleResponse(newArticle);
  }
}
