import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data/db.json");

export async function GET() {
  try {
    await fs.access(dbPath);
    const data = await fs.readFile(dbPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json([], { status: 200 }); // Return empty array if file doesn't exist
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    let products = [];
    try {
      const data = await fs.readFile(dbPath, "utf-8");
      products = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
    }
    products.push(newProduct);
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(products, null, 2));
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();
    const data = await fs.readFile(dbPath, "utf-8");
    let products = JSON.parse(data);
    products = products.map((p: any) => (p.id === updatedProduct.id ? updatedProduct : p));
    await fs.writeFile(dbPath, JSON.stringify(products, null, 2));
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Failed to edit product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const data = await fs.readFile(dbPath, "utf-8");
    let products = JSON.parse(data);
    products = products.filter((p: any) => p.id !== id);
    await fs.writeFile(dbPath, JSON.stringify(products, null, 2));
    return NextResponse.json({ message: "Mahsulot o'chirildi" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}