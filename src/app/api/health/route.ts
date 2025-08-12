import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

const DB_FILE = join(process.cwd(), "public", "db.json");

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  price: number;
  category: string;
  discount?: number;
  description?: string;
  image?: string;
}

async function readProducts(): Promise<Product[]> {
  try {
    const data = await readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    await writeFile(DB_FILE, JSON.stringify([], null, 2), "utf-8");
    return [];
  }
}

async function writeProducts(products: Product[]) {
  await writeFile(DB_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newProduct: Product = {
    id: uuidv4(),
    nameUz: body.nameUz,
    nameRu: body.nameRu,
    price: body.price,
    category: body.category,
    discount: body.discount ?? 0,
    description: body.description ?? "",
    image: body.image ?? "",
  };
  const products = await readProducts();
  products.push(newProduct);
  await writeProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}
