import Product from "../../../domain/product/entity/product";
import { v4 as uuid } from "uuid";
import ProductUpdateUseCase from "./update.product.usecase";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const product = new Product(uuid(), "Product Name", 10);

const input = {
    id: product.id,
    name: "Updater Product name",
    price: 20,
}

describe("Integration test update product use case", () => {

    let sequelize: Sequelize;

    beforeEach(async() => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });
    
        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });
    
    afterEach(async() => {
        sequelize.close();
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new ProductUpdateUseCase(productRepository);
        await productRepository.create(product);

        const result = await useCase.execute(input);

        expect(result).toEqual(input);
    });
});