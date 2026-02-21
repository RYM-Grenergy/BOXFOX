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
      const flatList = products.map((p) => {
        const formattedPrice = p.minPrice
          ? (p.maxPrice ? `₹${p.minPrice} - ₹${p.maxPrice}` : `₹${p.minPrice}`)
          : (p.price ? (p.price.toString().startsWith('₹') ? p.price : `₹${p.price}`) : "Price on Request");

        return {
          _id: p._id,
          id: p.wpId,
          name: p.name,
          category: p.categories[p.categories.length - 1] || "Uncategorized",
          price: formattedPrice,
          minPrice: p.minPrice,
          maxPrice: p.maxPrice,
          originalPrice: p.regular_price,
          discount: p.sale_price ? "Sale" : null,
          status: p.stock_status,
          images: p.images,
          img: p.images[0] || "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg",
          outOfStock: p.stock_status === "outofstock",
          badge: p.badge || (p.isFeatured ? "Featured" : null),
          hasVariants: p.type === "variable",
          description: p.description || '',
          short_description: p.short_description || '',
          brand: p.brand || 'BoxFox',
          minOrderQuantity: p.minOrderQuantity || 100,
          tags: p.tags || [],
          specifications: p.specifications || [],
          dimensions: p.dimensions || { length: 8.5, width: 6.5, height: 2, unit: 'inch' },
          pacdoraId: p.pacdoraId
        };
      });
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

      const formattedPrice = p.minPrice
        ? (p.maxPrice ? `₹${p.minPrice} - ₹${p.maxPrice}` : `₹${p.minPrice}`)
        : (p.price ? (p.price.toString().startsWith('₹') ? p.price : `₹${p.price}`) : "Price on Request");

      sectionsMap[primaryCat].items.push({
        id: p.wpId,
        name: p.name,
        price: formattedPrice,
        minPrice: p.minPrice,
        maxPrice: p.maxPrice,
        badge: p.badge || (p.isFeatured ? "Featured" : null),
        img: p.images[0] || "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg",
        images: p.images,
        hasVariants: p.type === "variable",
        outOfStock: p.stock_status === "outofstock",
        dimensions: p.dimensions || { length: 8.5, width: 6.5, height: 2, unit: 'inch' },
        pacdoraId: p.pacdoraId
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

    const processedImages = typeof data.images === 'string'
      ? data.images.split(',').map(s => s.trim()).filter(Boolean)
      : (Array.isArray(data.images) ? data.images : [data.img || "https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg"]);

    if (data._id) {
      // UPDATE
      const updatedProduct = await Product.findByIdAndUpdate(data._id, {
        ...data,
        price: data.minPrice ? String(data.minPrice) : undefined, // fallback for legacy
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        badge: data.badge,
        images: processedImages,
        categories: [data.category],
        type: data.hasVariants ? "variable" : "simple",
        dimensions: {
          length: parseFloat(data.length) || 8.5,
          width: parseFloat(data.width) || 6.5,
          height: parseFloat(data.height) || 2,
          unit: data.unit || 'inch'
        },
        brand: data.brand,
        minOrderQuantity: parseInt(data.minOrderQuantity) || 100,
        tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : data.tags,
        specifications: data.specifications,
        description: data.description,
        short_description: data.short_description,
        pacdoraId: data.pacdoraId
      }, { new: true });
      return NextResponse.json({ success: true, product: updatedProduct });
    }

    const product = await Product.create({
      ...data,
      price: data.minPrice ? String(data.minPrice) : undefined, // fallback for legacy
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      badge: data.badge,
      wpId,
      images: processedImages,
      categories: [data.category],
      type: data.hasVariants ? "variable" : "simple",
      dimensions: {
        length: parseFloat(data.length) || 8.5,
        width: parseFloat(data.width) || 6.5,
        height: parseFloat(data.height) || 2,
        unit: data.unit || 'inch'
      },
      brand: data.brand || 'BoxFox',
      minOrderQuantity: parseInt(data.minOrderQuantity) || 100,
      tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : data.tags,
      specifications: data.specifications,
      description: data.description,
      short_description: data.short_description,
      pacdoraId: data.pacdoraId
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

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    // First try deleting by wpId (if string is numeric), then string id, then objectId
    await Product.findOneAndDelete({
      $or: [
        { wpId: isNaN(parseInt(id)) ? 0 : parseInt(id) },
        { _id: id }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE Error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
