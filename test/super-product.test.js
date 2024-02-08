import supertest from "supertest";
import { expect } from "chai";
import "./db.js";
import { Router } from 'express';


const router = Router();

const requester = supertest("http://localhost:8080");


describe('Products endpoints', () => {
    let sessionCookie;

    let cookieTestDef;

    beforeEach(async () => {
        const user = {
            email: 'agusfanzoo@gmail.com',
            password:"123456",
            role: 'premium',
            cartID: '123asd',
            id: '55555',
            first_name: 'Agustin',
            last_name: 'Olmedo',
        };

        const userLogin = {
            email: user.email,
            password: user.password
        };

        const response = await requester.post("/api/sessions/login").send(userLogin);


        const cookieTest = response.headers["set-cookie"][0];
        console.log("Cookie Test: ",cookieTest);


        cookieTestDef = {
            name: cookieTest.split("=")[0],
            value: cookieTest.split("=")[1].split(";")[0]
        };
       
        console.log("cookie login",cookieTestDef);
           
    });


    describe('GET /api/products/{pid}', () => {
        it('should get a product by ID', async () => {
            const response = await requester.get('/api/products/6541c75e56446540e44ade03');
            expect(response.status).to.equal(200);
        });
    });

    describe('POST /api/products', () => {
        it('should create a new product', async () => {
            const createProduct = {
                product_name: 'Nuevo Producto',
                product_price: 109,
                stock: 5,
                product_description: 'Descripción del nuevo producto',
                owner: 'email@prueba.com',
            };

            const response = await requester
                .post('/api/products')
                .send({
                    ...createProduct,
                    role: 'premium',
                })
            expect(response.status).to.equal(200);
        });
    });
    
    describe('GET /api/products', () => {
        const user = {
            email: 'agusfanzoo@gmail.com',
            password:"123456",
            role: 'premium',
            cartID: '123asd',
            id: '55555',
            first_name: 'Agustin',
            last_name: 'Olmedo',
        };
        it('should get all products', async () => {
            const response = await requester
                .get(`/api/products?ids=${user.id}&roles=${user.role}&emails=${user.email}&cartIDs=${user.cartID}&last_names=${user.last_name}&first_names=${user.first_name}`)
                .set("Cookie", [`${cookieTestDef.name}=${cookieTestDef.value}`])
                .set("X-Testing-Request", "true");
                
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });
    });

    describe('DELETE /api/products/{id}', () => {
        it('should delete a product by ID', async () => {
            const response = await requester
                .delete('/api/products/65c32586f286fe8d006ea50d')

            expect(response.status).to.equal(200);
        });
    });


}); 
