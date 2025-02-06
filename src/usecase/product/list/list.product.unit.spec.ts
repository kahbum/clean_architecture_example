import { v4 as uuid } from "uuid";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product(uuid(), "Product1 Name", 10);
const product2 = new Product(uuid(), "Product2 Name", 20);

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test list products use case", () => {
    it("should list all products", async () => {
        const productRepository = MockRepository();
        const useCase = new ListProductUseCase(productRepository);

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