// pages/api/save-products.ts
import { writeFile } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const products = req.body;
      await writeFile('src/app/db.json', JSON.stringify(products, null, 2));
      res.status(200).json({ message: 'Products saved' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save products' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}