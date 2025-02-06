import Product from "../../../domain/product/entity/product";
import { v4 as uuid } from "uuid";
import ProductUpdateUseCase from "./update.product.usecase";

const product = new Product(uuid(), "Product Name", 10);

const input = {
    id: product.id,
    name: "Updater Product name",
    price: 20,
}

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test update product use case", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const useCase = new ProductUpdateUseCase(productRepository);

        const result = await useCase.execute(input);

        expect(result).toEqual(input);
    });

    it("should throw an error if the product doesn't exist", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });
        const useCase = new ProductUpdateUseCase(productRepository);

        await expect(useCase.execute(input)).rejects.toThrow(
            "Product not found"
        );
    });
});