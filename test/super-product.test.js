import supertest from "supertest";
import { expect } from "chai";
import "./db.js";
import { Router } from 'express';

const router = Router();


const requester = supertest("http://localhost:8080");


describe('Products endpoints', () => {
    let sessionCookie;

    beforeEach(async () => {
        const response = await requester
            .post('/api/sessions/login')
            .send({
                email: 'agusfanzoo@gmail.com',
                password: '123456',
            });

        expect(response.status).to.equal(200);

        sessionCookie = response.headers['set-cookie'];
    });

    describe('GET /api/products/{pid}', () => {
        it('should get a product by ID', async () => {
            const response = await requester
                .get('/api/products/65383ec1e365fbf2611b3dd9')
                .set('Cookie', sessionCookie);

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
                .send(createProduct)
                .set('Cookie', sessionCookie);

            expect(response.status).to.equal(200);
        });
    });
    
    describe('GET /api/products', () => {
        it('should get all products', async () => {
            const response = await requester
                .get('/api/products')
                .set('Cookie', sessionCookie);

            expect(response.status).to.equal(200);
        });
    });

    describe('DELETE /api/products/{id}', () => {
        it('should delete a product by ID', async () => {
            const response = await requester
                .delete('/api/products/6545ad395def71ae5c77d64a')
                .set('Cookie', sessionCookie);

            expect(response.status).to.equal(200);
        });
    });
   

});



/* describe('Products endpoints', () => {

        beforeEach( async () => {
            const sessionlogin = await requester
                .post('/api/sessions/login')
                .send({ 
                    email:'agusfanzoo@gmail.com',
                    password:'123456',
                });
        }); */

        /* describe('GET /api/products', () => {
            it('should get all products', async () => {
                const response = await requester.get('/api/products');
                expect(response.status).to.equal(200);
            });
        }) */

        /* describe('GET /api/products/{pid}', () => {
            it('should get a product by ID', async () => {
                const response = await requester.get('/api/products/6545ad105def71ae5c77d648');
                expect(response.status).to.equal(200);
            });
        }) */

        /* describe('DELETE /api/products/{id}', () => {
            it('should delete a product by ID', async () => {
                const response = await requester.delete('/api/products/6545ad395def71ae5c77d64a');
                expect(response.status).to.equal(200);
            });
        }); */
        
        /* describe('POST /api/products', () => {
            it('should create a new product', async () => {
                const createProduct = {
                    product_name: 'Nuevo Producto',
                    product_price: 109,
                    stock: 5,
                    product_description: 'Descripción del nuevo producto',
                    owner: 'email@prueba.com',
                };

                const response = await requester.post('/api/products').send(createProduct);
                expect(response.status).to.equal(200);
            });
        }) */
        
        
   /*  });
 */


