import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    const searchTerm = searchParams.get("search") || "";

    // Fetch query
    let query = {
      type: { $in: ["simple", "variable"] },
      parent_id: { $eq: 0 }, // Only top level
    };

    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: "i" };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(searchTerm ? 10 : 0);

    // Transform into the sections structure or flat list for admin
    if (isAdmin) {
      const flatList = products.map((p) => ({
        id: p.wpId,
        name: p.name,
        category: p.categories[p.categories.length - 1] || "Uncategorized",
        price: p.price || p.regular_price || "Price on Request",
        status: p.stock_status,
        img:
          p.images[0] ||
          "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg",
        outOfStock: p.stock_status === "outofstock",
      }));
      return NextResponse.json(flatList);
    }

    // For main site - Grouped by Category
    const sectionsMap = {};

    products.forEach((p) => {
      // Use the last category as it's usually the most specific one
      const primaryCat = p.categories[p.categories.length - 1] || "Packaging";

      if (!sectionsMap[primaryCat]) {
        sectionsMap[primaryCat] = {
          category: primaryCat,
          tabs: ["All Items"],
          items: [],
        };
      }

      sectionsMap[primaryCat].items.push({
        id: p.wpId,
        name: p.name,
        price: p.price ? `₹${p.price}` : "Price on Request",
        originalPrice: p.regular_price ? parseFloat(p.regular_price) : null,
        discount: p.sale_price ? "Sale" : null,
        img:
          p.images[0] ||
          "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg",
        badge: p.isFeatured ? "Featured" : null,
        hasVariants: p.type === "variable",
        outOfStock: p.stock_status === "outofstock",
      });
    });

    // Limit items per category for the homepage and convert to array
    const sections = Object.values(sectionsMap)
      .filter((s) => s.items.length > 0)
      .map((s) => ({
        ...s,
        items: s.items.slice(0, 8),
      }));

    return NextResponse.json(sections);
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    // Ensure wpId is a Number. If provided id is a string like "prod-123", strip it or use timestamp.
    let wpId = parseInt(data.id);
    if (isNaN(wpId)) {
      wpId = Date.now(); // Use timestamp as unique numeric ID for manual products
    }

    const product = await Product.create({
      ...data,
      wpId,
      images: [data.img],
      categories: [data.category],
      type: data.hasVariants ? "variable" : "simple",
    });
    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("POST Error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}
