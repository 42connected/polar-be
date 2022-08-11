import { Categories } from "../../entities/categories.entity";
import { Keywords } from "../../entities/keywords.entity";
import { KeywordCategories } from "../../entities/keyword-categories.entity";
import { setSeederFactory } from "typeorm-extension";

interface KeywordCategoriesMetaInterface {
    keywordsMeta: Keywords[];
    categoriesMeta: Categories[];
}

export default setSeederFactory(KeywordCategories, (faker, meta : KeywordCategoriesMetaInterface) => {
    const keywordCategories = new KeywordCategories();

    keywordCategories.keywordId = meta.keywordsMeta[faker.datatype.number(meta.keywordsMeta.length - 1)].id;
    keywordCategories.categoryId = meta.categoriesMeta[faker.datatype.number(meta.categoriesMeta.length - 1)].id;
    return keywordCategories;
})