import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository"
import ProductModel from "../../../infrastructure/product/repository/product.model";
import FindProductUseCase from "./find.product.usecase";
import Product from "../../../domain/product/entity/product";
import { v4 as uuid } from "uuid";

describe("Integration test find product use case", () => {

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

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new FindProductUseCase(productRepository);

        const product = new Product(uuid(), "Product Name", 10);
        await productRepository.create(product);

        const input = {
            id: product.id,
        }

        const expectedOutput = {
            id: product.id,
            name: product.name,
            price: product.price,
        }

        const result = await useCase.execute(input);

        expect(result).toEqual(expectedOutput);
    });
});