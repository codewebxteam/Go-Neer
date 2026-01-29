export const MOCK_USERS = [
    {
        id: 'user-1',
        email: 'user@test.com',
        password: 'password123',
        user_metadata: { full_name: 'Test User' },
        role: 'user'
    },
    {
        id: 'vendor-1',
        email: 'vendor@test.com',
        password: 'password123',
        user_metadata: { full_name: 'Test Vendor' },
        role: 'vendor'
    },
    {
        id: 'admin-1',
        email: 'admin@test.com',
        password: 'password123',
        user_metadata: { full_name: 'Admin User' },
        role: 'admin'
    }
];

export const MOCK_PROFILES = [
    { id: 'user-1', full_name: 'Test User', phone: '1234567890', role: 'user' },
    { id: 'vendor-1', full_name: 'Test Vendor', phone: '9876543210', role: 'vendor' },
    { id: 'admin-1', full_name: 'Admin User', phone: '1122334455', role: 'admin' }
];

export const MOCK_VENDORS = [
    {
        id: 'v1',
        user_id: 'vendor-1',
        shop_name: 'Aqua Pure Supplies',
        address: '123 Water St, Delhi',
        rating: 4.8,
        is_open: true,
        image_url: 'https://images.unsplash.com/photo-1541807353925-5f96944e8574?w=500&auto=format&fit=crop&q=60',
        latitude: 28.6139,
        longitude: 77.2090,
        city: 'Delhi',
        distance: 2.5,
        delivery_time: '25-30 mins'
    },
    {
        id: 'v2',
        user_id: 'vendor-2',
        shop_name: 'Himalayan Flow',
        address: '456 Mountain Rd, Mumbai',
        rating: 4.5,
        is_open: true,
        image_url: 'https://images.unsplash.com/photo-1621250395781-a7b6b3e75E7e?w=500&auto=format&fit=crop&q=60',
        latitude: 19.0760,
        longitude: 72.8777,
        city: 'Mumbai',
        distance: 5.2,
        delivery_time: '35-40 mins'
    },
    {
        id: 'v3',
        user_id: 'vendor-3',
        shop_name: 'Crystal Water Hub',
        address: '789 Pure Lane, Bangalore',
        rating: 4.7,
        is_open: true,
        image_url: 'https://images.unsplash.com/photo-1628273519198-e6b5d3c21fd5?w=500&auto=format&fit=crop&q=60',
        latitude: 12.9716,
        longitude: 77.5946,
        city: 'Bangalore',
        distance: 3.8,
        delivery_time: '30-35 mins'
    },
    {
        id: 'v4',
        user_id: 'vendor-4',
        shop_name: 'Spring Water Store',
        address: '321 Fresh Ave, Delhi',
        rating: 4.6,
        is_open: true,
        image_url: 'https://images.unsplash.com/photo-1585070526059-41ce6da5b62f?w=500&auto=format&fit=crop&q=60',
        latitude: 28.5355,
        longitude: 77.3910,
        city: 'Delhi',
        distance: 1.8,
        delivery_time: '20-25 mins'
    },
    {
        id: 'v5',
        user_id: 'vendor-5',
        shop_name: 'Anand Pure Water',
        address: '45 Rajendra Nagar, Anand',
        rating: 4.9,
        is_open: true,
        image_url: 'https://images.unsplash.com/photo-1621250395781-a7b6b3e75E7e?w=500&auto=format&fit=crop&q=60',
        latitude: 22.5595,
        longitude: 72.9520,
        city: 'Anand',
        distance: 2.1,
        delivery_time: '20-25 mins'
    },
    {
        id: 'v6',
        user_id: 'vendor-6',
        shop_name: 'Anand Springs',
        address: '78 Vidyapith Road, Anand',
        rating: 4.7,
        is_open: true,
        image_url: 'https://images.unsplash.com/photo-1628273519198-e6b5d3c21fd5?w=500&auto=format&fit=crop&q=60',
        latitude: 22.5650,
        longitude: 72.9450,
        city: 'Anand',
        distance: 1.5,
        delivery_time: '15-20 mins'
    },
    {
        id: 'v7',
        user_id: 'vendor-7',
        shop_name: 'Anand Aqua Solutions',
        address: '102 GSFC Road, Anand',
        rating: 4.8,
        is_open: true,
        image_url: 'https://images.unsplash.com/photo-1541807353925-5f96944e8574?w=500&auto=format&fit=crop&q=60',
        latitude: 22.5700,
        longitude: 72.9500,
        city: 'Anand',
        distance: 2.8,
        delivery_time: '25-30 mins'
    }
];

export const MOCK_PRODUCTS = [
    {
        id: 'p1',
        vendorId: 'v1',
        name: '20L Bisleri Water Jar',
        description: 'Pure mineral water in a 20L jar. Refundable deposit required.',
        price: 80,
        stock: 50,
        image: 'https://m.media-amazon.com/images/I/41-j+-4XbSL.jpg'
    },
    {
        id: 'p2',
        vendorId: 'v1',
        name: '1L Water Bottle (Case of 12)',
        description: 'Perfect for events and parties.',
        price: 240,
        stock: 100,
        image: 'https://m.media-amazon.com/images/I/61Z6y3jXjmL._SL1500_.jpg'
    },
    {
        id: 'p3',
        vendorId: 'v1',
        name: 'Cooling Water Dispenser',
        description: 'Electric water dispenser with cooling feature.',
        price: 3500,
        stock: 5,
        image: 'https://m.media-amazon.com/images/I/41K0p5S5HFL.jpg'
    },
    {
        id: 'p4',
        vendorId: 'v2',
        name: '10L Himalayan Spring Water',
        description: 'Premium spring water from Himalayas.',
        price: 120,
        stock: 40,
        image: 'https://m.media-amazon.com/images/I/41-j+-4XbSL.jpg'
    },
    {
        id: 'p5',
        vendorId: 'v2',
        name: 'Bottled Spring Water 500ml (Pack of 24)',
        description: 'Pure spring water in convenient 500ml bottles.',
        price: 180,
        stock: 80,
        image: 'https://m.media-amazon.com/images/I/61Z6y3jXjmL._SL1500_.jpg'
    },
    {
        id: 'p6',
        vendorId: 'v3',
        name: 'Crystal Clear RO Water',
        description: 'Advanced RO filtered drinking water.',
        price: 100,
        stock: 60,
        image: 'https://m.media-amazon.com/images/I/61Z6y3jXjmL._SL1500_.jpg'
    },
    {
        id: 'p7',
        vendorId: 'v3',
        name: 'Water Purifier (Wall Mounted)',
        description: 'Wall-mounted water purifier with RO technology.',
        price: 8999,
        stock: 3,
        image: 'https://m.media-amazon.com/images/I/41K0p5S5HFL.jpg'
    },
    {
        id: 'p8',
        vendorId: 'v4',
        name: 'Fresh Spring Water 20L',
        description: 'Fresh spring water for the whole family.',
        price: 90,
        stock: 45,
        image: 'https://m.media-amazon.com/images/I/41-j+-4XbSL.jpg'
    },
    {
        id: 'p9',
        vendorId: 'v4',
        name: 'Water Cooler Machine',
        description: 'Electric water cooler with hot and cold options.',
        price: 4500,
        stock: 7,
        image: 'https://m.media-amazon.com/images/I/41K0p5S5HFL.jpg'
    },
    {
        id: 'p10',
        vendorId: 'v5',
        name: 'Pure Mineral Water 20L',
        description: 'Mineral-rich water sourced from natural springs.',
        price: 85,
        stock: 55,
        image: 'https://m.media-amazon.com/images/I/41-j+-4XbSL.jpg'
    },
    {
        id: 'p11',
        vendorId: 'v5',
        name: 'Water Bottles 1L (Pack of 6)',
        description: 'Reusable water bottles made from BPA-free plastic.',
        price: 299,
        stock: 120,
        image: 'https://m.media-amazon.com/images/I/61Z6y3jXjmL._SL1500_.jpg'
    },
    {
        id: 'p12',
        vendorId: 'v6',
        name: 'Anand Spring Water 20L',
        description: 'Pure spring water from the Anand region.',
        price: 95,
        stock: 50,
        image: 'https://m.media-amazon.com/images/I/41-j+-4XbSL.jpg'
    },
    {
        id: 'p13',
        vendorId: 'v6',
        name: 'Water Filter Pitcher',
        description: 'Portable water filter pitcher for home use.',
        price: 599,
        stock: 30,
        image: 'https://m.media-amazon.com/images/I/61Z6y3jXjmL._SL1500_.jpg'
    },
    {
        id: 'p14',
        vendorId: 'v7',
        name: 'Premium Aqua Water 20L',
        description: 'Premium quality water with advanced filtration.',
        price: 100,
        stock: 48,
        image: 'https://m.media-amazon.com/images/I/41-j+-4XbSL.jpg'
    },
    {
        id: 'p15',
        vendorId: 'v7',
        name: 'Water Dispenser Stand',
        description: 'Heavy-duty stand for water dispensers.',
        price: 1200,
        stock: 15,
        image: 'https://m.media-amazon.com/images/I/41K0p5S5HFL.jpg'
    },
    {
        id: 'p16',
        vendorId: 'v7',
        name: 'Water Testing Kit',
        description: 'Complete water quality testing kit for home use.',
        price: 499,
        stock: 25,
        image: 'https://m.media-amazon.com/images/I/61Z6y3jXjmL._SL1500_.jpg'
    }
];

export const MOCK_ORDERS = [
    {
        id: 'o1',
        created_at: '2023-10-25T10:00:00Z',
        total_amount: 320,
        status: 'Delivered',
        customer: 'Test User',
        items: [
            { name: '20L Bisleri Water Jar', quantity: 4, price: 80 }
        ]
    },
    {
        id: 'o2',
        created_at: '2023-10-26T14:30:00Z',
        total_amount: 80,
        status: 'Pending',
        customer: 'Test User',
        items: [
            { name: '20L Bisleri Water Jar', quantity: 1, price: 80 }
        ]
    }
];
