export const ACCOUNT_DATA = {
  user: {
    id: "usr_901",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    role: "Guest User",
    greeting: "Welcome back!",
  },

  orders: [
    {
      id: "ORD-001",
      date: "15 January 2024",
      formattedDate: "15/01/2024",
      status: "Delivered",
      statusType: "delivered", // For badge color
      total: 1299,
      itemCount: 2,
      deliveryAddress: "123 MG Road, Bangalore 560001",
      items: [
        {
          id: "item_1",
          name: "LED Candles Set of 6",
          qty: 1,
          price: 899,
          image: "/demo-products/candles-1.webp",
        },
        {
          id: "item_2",
          name: "Floating Candles Pack",
          qty: 1,
          price: 399,
          image: "/demo-products/candles-2.webp",
        },
      ],
    },
    {
      id: "ORD-002",
      date: "10 January 2024",
      formattedDate: "10/01/2024",
      status: "Shipped",
      statusType: "shipped",
      total: 699,
      itemCount: 1,
      deliveryAddress: "123 MG Road, Bangalore 560001",
      items: [
        {
          id: "item_3",
          name: "Festive Diya Gift Hamper",
          qty: 1,
          price: 699,
          image: "/demo-products/diya-1.webp",
        },
      ],
    },
    {
      id: "ORD-003",
      date: "5 January 2024",
      formattedDate: "05/01/2024",
      status: "Processing",
      statusType: "processing",
      total: 549,
      itemCount: 1,
      deliveryAddress: "456 Tech Park, Bangalore 560037",
      items: [
        {
          id: "item_4",
          name: "Handmade Paper Gift Box",
          qty: 1,
          price: 549,
          image: "/demo-products/box-1.webp",
        },
      ],
    },
  ],

  addresses: [
    {
      id: 1,
      tag: "Home",
      isDefault: true,
      name: "John Doe",
      line1: "123 MG Road, Near City Mall",
      cityState: "Bangalore, Karnataka - 560001",
      phone: "+91 9876543210",
    },
    {
      id: 2,
      tag: "Office",
      isDefault: false,
      name: "John Doe",
      line1: "456 Tech Park, 5th Floor",
      cityState: "Bangalore, Karnataka - 560037",
      phone: "+91 9876543210",
    },
  ],
};
