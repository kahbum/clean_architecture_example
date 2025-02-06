import { v4 as uuid } from "uuid";
import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product(uuid(), "Product Name", 10);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test find product use case", () => {
    it("should find a product", async () => {
        const productRepository = MockRepository();
        const useCase = new FindProductUseCase(productRepository);
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

    it("should throw an error if a product could not be found", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        })
        const useCase = new FindProductUseCase(productRepository);
        const input = {
            id: product.id,
        }

        expect(() => {
            return useCase.execute(input);
        }).rejects.toThrow("Product not found");
    });
});