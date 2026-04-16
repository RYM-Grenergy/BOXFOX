# BoxFox Database Design

## Core Collections

### User
User accounts with authentication, preferences, and design assets.

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String,
  role: ['user', 'admin', 'staff_fulfillment'],
  phone: String,
  businessName: String,
  shippingAddress: {
    street, apartment, city, state, zipCode, country
  },
  wishlist: [ProductId],
  aiGenerationCount: Number,
  aiUnlimitedUntil: Date,
  brandVault: {
    logos: [{url, name, createdAt}],
    colors: [String],
    fonts: [String]
  },
  timestamps: {createdAt, updatedAt}
}
```

### Order
Customer orders with items, shipping, and payment tracking.

```javascript
{
  _id: ObjectId,
  orderId: String (unique),
  userId: UserId (ref),
  customer: {name, email, phone},
  shipping: {address, city, state, pincode},
  items: [{
    productId, name, quantity, price, variant, 
    image, customDesign
  }],
  total: Number,
  discount: Number,
  couponCode: String,
  status: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
  paid: Boolean,
  labNotes: String,
  timestamps: {createdAt, updatedAt}
}
```

### Product
Complete product catalog with pricing & specifications.

```javascript
{
  _id: ObjectId,
  wpId: Number (unique),
  sku: String (unique, sparse),
  type: ['simple', 'variable', 'variation'],
  name: String,
  description: String,
  price: String,
  regular_price: String,
  sale_price: String,
  categories: [String],
  tags: [String],
  images: [String],
  stock_quantity: Number,
  stock_status: String,
  parent_id: Number,
  minOrderQuantity: Number,
  dimensions: {length, width, height, unit},
  weight: Number,
  attributes: [{name, options}],
  specifications: [{key, value}],
  pacdoraId: String,
  isFeatured: Boolean,
  timestamps: {createdAt, updatedAt}
}
```

### BoxCategory
Categories for customizable boxes.

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  image: String,
  timestamps: {createdAt, updatedAt}
}
```

### BoxProductGroup
Groups of box products within categories.

```javascript
{
  _id: ObjectId,
  categoryId: BoxCategoryId (ref),
  name: String,
  description: String,
  image: String,
  timestamps: {createdAt, updatedAt}
}
```

### BoxProduct
Individual box specifications with pricing formulas.

```javascript
{
  _id: ObjectId,
  groupId: BoxProductGroupId (ref),
  name: String,
  defaultLength: Number,
  defaultBreadth: Number,
  defaultHeight: Number,
  minDimensions: {l, b, h},
  maxDimensions: {l, b, h},
  defaultMaterial: String,
  defaultColor: String,
  defaultTexture: String,
  priceFormulaType: ['area', 'volume', 'fixed'],
  basePrice: Number,
  multiplier: Number,
  flapType: ['rsc', 'mailer', 'tuck_top', 'auto_bottom'],
  has3DPreview: Boolean,
  pacdoraId: String,
  timestamps: {createdAt, updatedAt}
}
```

### SavedDesign
User-created and shareable custom designs.

```javascript
{
  _id: ObjectId,
  userId: UserId (ref),
  name: String,
  shareId: String (unique, sparse),
  isPublic: Boolean,
  customDesign: {
    textures, colors, textureSettings,
    text, textStyle, textColor, textSettings,
    dimensions, unit
  },
  productId: String,
  thumbnail: String,
  timestamps: {createdAt, updatedAt}
}
```

## Relationships

```
User
  ├── wishlist → [Product]
  └── brandVault → {logos, colors, fonts}

Order
  ├── userId → User
  └── items[].productId → Product | BoxProduct

SavedDesign
  ├── userId → User
  └── productId → Product | BoxProduct

BoxProductGroup
  └── categoryId → BoxCategory

BoxProduct
  └── groupId → BoxProductGroup
```

