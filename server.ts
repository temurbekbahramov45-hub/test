import { readFile, writeFile } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_FILE = join(process.cwd(), 'data', 'public/db/db.json');

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  price: number;
  image?: string;
  category: string;
  discount?: number;
  description?: string;
}

// Initialize db.json if it doesn't exist
async function initializeDb() {
  try {
    await readFile(DB_FILE, 'utf-8');
  } catch (error) {
    await writeFile(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Read products from db.json
async function readProducts(): Promise<Product[]> {
  await initializeDb();
  const data = await readFile(DB_FILE, 'utf-8');
  return JSON.parse(data) as Product[];
}

// Write products to db.json
async function writeProducts(products: Product[]): Promise<void> {
  await writeFile(DB_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const id = Array.isArray(slug) ? slug[0] : slug;

  try {
    switch (req.method) {
      case 'GET':
        // Fetch all products
        const products = await readProducts();
        res.status(200).json(products);
        break;

      case 'POST':
        // Add a new product
        const { nameUz, nameRu, price, category, image, discount, description } = req.body;
        if (!nameUz || !nameRu || !price || !category) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const newProduct: Product = {
          id: uuidv4(), // Generate unique ID
          nameUz,
          nameRu,
          price: Number(price),
          category,
          image: image || undefined,
          discount: discount ? Number(discount) : undefined,
          description: description || undefined,
        };

        const currentProducts = await readProducts();
        currentProducts.push(newProduct);
        await writeProducts(currentProducts);
        res.status(201).json(newProduct);
        break;

      case 'PUT':
        // Update a product by ID
        if (!id) {
          return res.status(400).json({ error: 'Product ID is required' });
        }

        const { nameUz: updateNameUz, nameRu: updateNameRu, price: updatePrice, category: updateCategory, image: updateImage, discount: updateDiscount, description: updateDescription } = req.body;

        if (!updateNameUz || !updateNameRu || !updatePrice || !updateCategory) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const productsToUpdate = await readProducts();
        const productIndex = productsToUpdate.findIndex((p) => p.id === id);

        if (productIndex === -1) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const updatedProduct: Product = {
          id,
          nameUz: updateNameUz,
          nameRu: updateNameRu,
          price: Number(updatePrice),
          category: updateCategory,
          image: updateImage || undefined,
          discount: updateDiscount ? Number(updateDiscount) : undefined,
          description: updateDescription || undefined,
        };

        productsToUpdate[productIndex] = updatedProduct;
        await writeProducts(productsToUpdate);
        res.status(200).json(updatedProduct);
        break;

      case 'DELETE':
        // Delete a product by ID
        if (!id) {
          return res.status(400).json({ error: 'Product ID is required' });
        }

        const productsToDelete = await readProducts();
        const filteredProducts = productsToDelete.filter((p) => p.id !== id);

        if (filteredProducts.length === productsToDelete.length) {
          return res.status(404).json({ error: 'Product not found' });
        }

        await writeProducts(filteredProducts);
        res.status(200).json({ message: 'Product deleted' });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}