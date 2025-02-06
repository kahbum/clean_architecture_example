import { Sequelize } from "sequelize-typescript";
import CreateProductuseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const input = {
    type: "a",
    name: "Product Name",
    price: 10,
};

describe("Integration test create product use case", () => {

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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductuseCase(productRepository);

        const result = await useCase.execute(input);

        expect(result).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });
});