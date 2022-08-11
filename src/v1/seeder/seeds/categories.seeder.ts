import { Categories } from "../../entities/categories.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { CategoriesInterface } from "src/v1/interface/categories/categories.interface";

export class CategoriesSeeder implements Seeder{
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const categoryRepository = dataSource.getRepository(Categories);
        console.log('Seeding categories...');

        const categoryData: CategoriesInterface = {
            name: '전체',
        };

        const isExists = await categoryRepository.findOneBy({
            name: categoryData.name,
        });
        if (!isExists) {
            const newUser = categoryRepository.create(categoryData);
            await categoryRepository.save(newUser);
        }

        const categoriesFactory = await factoryManager.get(Categories);
        await categoriesFactory.saveMany(5);
    }
}