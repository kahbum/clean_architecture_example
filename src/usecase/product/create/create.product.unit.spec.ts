import CreateProductuseCase from "./create.product.usecase";

const input = {
    type: "a",
    name: "Product Name",
    price: 10,
};

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
}

describe("Unit test create product use case", () => {

    beforeEach(() => {
        input.type = "a";
        input.name = "Product Name";
        input.price = 10;
    })
    
    it("should create a product", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductuseCase(productRepository);

        const result = await useCase.execute(input);

        expect(result).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });

    it("should throw an error when type is missing", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductuseCase(productRepository);

        input.type = "";

        await expect(useCase.execute(input)).rejects.toThrow(
            "Product type not supported"
        );
    });

    it("should throw an error when name is missing", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductuseCase(productRepository);

        input.name = "";

        await expect(useCase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });

    it("should throw an error when price is not greater than zero", async () => {
        const productRepository = MockRepository();
        const useCase = new CreateProductuseCase(productRepository);

        input.price = 0;

        await expect(useCase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        );
    });
});