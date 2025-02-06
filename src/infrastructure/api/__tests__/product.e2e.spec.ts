import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const product = {
            type: "a",
            name: "Product Name",
            price: 10
        };
        const response = await request(app)
        .post("/product")
        .send(product);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(product.name);
        expect(response.body.price).toBe(product.price);
    });

    it("should return 500 when trying to create a product without name", async () => {
        const product = {
            type: "a",
            price: 10,
        };
        const response = await request(app)
        .post("/product")
        .send(product);
        console.log(response.body);

        expect(response.status).toBe(500);
    });

    it("should list all products", async () => {
        const product1 = {
            type: "a",
            name: "Product Name",
            price: 10
        };
        const response = await request(app)
        .post("/product")
        .send(product1);
        expect(response.status).toBe(200);

        const product2 = {
            type: "a",
            name: "Product Name 2",
            price: 20
        };
        const response2 = await request(app)
        .post("/product")
        .send(product2);
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/product").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);

        const productResponse1 = listResponse.body.products[0];
        expect(productResponse1.name).toBe(product1.name);
        expect(productResponse1.price).toBe(product1.price);

        const productResponse2 = listResponse.body.products[1];
        expect(productResponse2.name).toBe(product2.name);
        expect(productResponse2.price).toBe(product2.price);
    });
});