import { Controller, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('products')
  listProducts(@Query() query: ListProductsQueryDto) {
    return this.catalog.listProducts(query);
  }

  @Get('products/:sku')
  getProduct(
    @Param('sku') sku: string,
    @Query('locale', new ParseEnumPipe({ en: 'en', km: 'km' }, { optional: true })) locale?: 'en' | 'km',
  ) {
    return this.catalog.getProduct(sku, locale ?? 'en');
  }

  @Get('categories')
  listCategories(
    @Query('locale', new ParseEnumPipe({ en: 'en', km: 'km' }, { optional: true })) locale?: 'en' | 'km',
  ) {
    return this.catalog.listCategories(locale ?? 'en');
  }
}
