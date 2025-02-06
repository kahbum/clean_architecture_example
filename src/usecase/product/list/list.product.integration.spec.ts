import { v4 as uuid } from "uuid";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Integration test list products use case", () => {

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

    it("should list all products", async () => {
        const productRepository = new ProductRepository();
        const useCase = new ListProductUseCase(productRepository);

        const product1 = new Product(uuid(), "Product1 Name", 10);
        await productRepository.create(product1);
        const product2 = new Product(uuid(), "Product2 Name", 20);
        await productRepository.create(product2);
        
        const result = await useCase.execute({});

        expect(result.products.length).toBe(2);
        expect(result.products[0].id).toBe(product1.id);
        expect(result.products[0].name).toBe(product1.name);
        expect(result.products[0].price).toBe(product1.price);
        expect(result.products[1].id).toBe(product2.id);
        expect(result.products[1].name).toBe(product2.name);
        expect(result.products[1].price).toBe(product2.price);
    });
});