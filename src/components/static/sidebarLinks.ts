export const sidebarLinks = [
  {
    id: 1,
    title: "Dashboard",
    icon: "home.svg",
    slug: "/",
  },
  {
    id: 2,
    title: "Manage Categories",
    icon: "list.svg",
    subLinks: [
      {
        subtitle: "Categories",
        slug: "/category",
      },
      {
        subtitle: "Add Category",
        slug: "categories/create",
      },
    ],
  },
  {
    id: 3,
    title: "Manage Products ",
    icon: "product.png",
    subLinks: [
      {
        subtitle: "New Product",
        slug: "/products/create",
      },
      {
        subtitle: "All Products",
        slug: "/products",
      },
      {
        subtitle: "Attributes",
        slug: "/attributes",
      },
      {
        subtitle: "Stock Out Products",
        slug: "/products/stockout",
      },
      {
        subtitle: "CSV Import & Export",
        slug: "/csv",
      },
      {
        subtitle: "Product Reviews",
        slug: "/products/reviews",
      },
    ],
  },
  {
    id: 3,
    title: "Manage Orders ",
    icon: "order.png",
    subLinks: [
      {
        subtitle: "All Orders",
        slug: "/orders",
      },
      {
        subtitle: "Custom Orders",
        slug: "/orders/custom",
      },
      {
        subtitle: "Pending Orders",
        slug: "/orders/pending",
      },
      {
        subtitle: "Delivered Orders",
        slug: "/orders/delivered",
      },
      {
        subtitle: "Canceled Orders",
        slug: "/orders/canceled",
      },
    ],
  },
  {
    id: 45,
    title: "Refund",
    icon: "refund.png",
    subLinks: [
      {
        subtitle: "Refund",
        slug: "/refund",
      },
    ],
  },
  {
    id: 4,
    title: "Manage Blogs",
    icon: "blog.png",
    subLinks: [
      {
        subtitle: "Blogs",
        slug: "/blogs",
      },
      {
        subtitle: "Comments",
        slug: "/blogs/comments",
      },
    ],
  },
  {
    id: 5,
    title: "Customers ",
    icon: "group.png",
    slug: "/customers",
  },
  {
    id: 6,
    title: "Notifications",
    icon: "bell.png",
    subLinks: [
      {
        subtitle: "Add",
        slug: "/notification/create",
      },
      {
        subtitle: "All notifications",
        slug: "/notification",
      },
    ],
  },
  {
    id: 6,
    title: "Videos",
    icon: "video.png",
    subLinks: [
      {
        subtitle: "All Videos",
        slug: "/videos",
      },
      {
        subtitle: "Add New Video",
        slug: "/videos/create",
      },
    ],
  },
  {
    id: 7,
    title: "Manage Faqs",
    icon: "faq.png",
    subLinks: [
      {
        subtitle: "Faqs",
        slug: "/faqs",
      },
    ],
  },

  {
    id: 8,
    title: "Marketing",
    icon: "promotion.png",
    subLinks: [
      {
        subtitle: "Coupons",
        slug: "/coupons",
      },
    ],
  },

  {
    id: 8,
    title: "Banner",
    icon: "advertising.png",
    subLinks: [
      {
        subtitle: "Ads Banner",
        slug: "/banner",
      },
    ],
  },
  {
    id: 9,
    title: "Support",
    icon: "support-ticket.png",
    subLinks: [
      {
        subtitle: "Support",
        slug: "/support",
      },
      {
        subtitle: "Queries",
        slug: "/queries",
      },
      {
        subtitle: "Subscriber",
        slug: "/subscriber",
      },
    ],
  },
  {
    id: 10,
    title: "Payment",
    icon: "emi.png",
    subLinks: [
      {
        subtitle: "Available EMI",
        slug: "/emi",
      },
      {
        subtitle: "Add Bank",
        slug: "/emi/create",
      },
      {
        subtitle: "Payment Message",
        slug: "/payment-message",
      },
    ],
  },
  {
    id: 11,
    title: "Site Settings",
    icon: "setting.png",
    subLinks: [
      {
        subtitle: "Home Page",
        slug: "/setup/home-page",
      },
      {
        subtitle: "Services",
        slug: "/setup/services",
      },
      {
        subtitle: "Footer",
        slug: "/setup/setting",
      },
      /* {
        subtitle: 'Homepage Sliders',
        slug: '/setup/sliders',
      }, */
      {
        subtitle: "Pages",
        slug: "/setup/pages",
      },
      {
        subtitle: "Menus",
        slug: "/setup/menus",
      },
      {
        subtitle: "Shipping",
        slug: "/shipping",
      },
    ],
  },
  {
    id: 11,
    title: "Staff",
    icon: "user.png",
    subLinks: [
      {
        subtitle: "All Staffs",
        slug: "/staffs",
      },
      {
        subtitle: "Staff permissions",
        slug: "/roles",
      },
    ],
  },
];
