import { Admins } from "../../entities/admins.entity";
import { AdminsInterface } from "src/v1/interface/admins/admins.interface";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(Admins, (faker) => {
    const admins: AdminsInterface = new Admins();

    admins.name = faker.name.firstName('male');
    admins.intraId = faker.name.lastName('male');
    return admins
})