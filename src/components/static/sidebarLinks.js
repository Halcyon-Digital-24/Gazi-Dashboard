const permissions = localStorage.getItem('user'); 

let userPermission;
// Check if user data exists
if (permissions) {
  // Parse user data as JSON
  userPermission = JSON.parse(permissions).permissions;
  console.log(userPermission);
} else {
  console.error("User data not found in local storage");
}

// Sidebar links that are always visible
const commonLinks = [
  {
    id: 1,
    title: "Dashboard",
    icon: "home.svg",
    slug: "/",
  },
];

export const allSidebarLinks = [
  {
    id: 2,
    title: "Manage Categories",
    icon: "list.svg",
    role_identity:"categories", 
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
    role_identity:"products", 
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
    id: 4,
    title: "Manage Orders ",
    icon: "order.png",
    role_identity:"orders", 
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
    id: 5,
    title: "Refund",
    icon: "refund.png",
    role_identity:"refund", 
    subLinks: [
      {
        subtitle: "Refund",
        slug: "/refund",
      },
    ],
  },
  {
    id: 6,
    title: "Manage Blogs",
    icon: "blog.png",
    role_identity:"blogs", 
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
    id: 7,
    title: "Customers ",
    role_identity:"customers", 
    icon: "group.png",
    slug: "/customers",
  },
  {
    id: 8,
    title: "Notifications",
    role_identity:"notifications", 
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
    id: 9,
    title: "Videos",
    icon: "video.png",
    role_identity:"videos", 
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
    id: 10,
    title: "Manage Faqs",
    icon: "faq.png",
    role_identity:"faqs",
    subLinks: [
      {
        subtitle: "Faqs",
        slug: "/faqs",
      },
    ],
  },

  {
    id: 11,
    title: "Marketing",
    role_identity:"marketing",
    icon: "promotion.png",
    subLinks: [
      {
        subtitle: "Coupons",
        slug: "/coupons",
      },
    ],
  },

  {
    id: 12,
    title: "Ads",
    icon: "advertising.png",
    role_identity:"ads",
    subLinks: [
      {
        subtitle: "Ads Banner",
        slug: "/banner",
      },
    ],
  },
  {
    id: 13,
    title: "Support",
    icon: "support-ticket.png",
    role_identity:"support",
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
    id: 14,
    title: "Payment",
    icon: "emi.png",
    role_identity:"payment",
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
    id: 15,
    title: "Site Settings",
    icon: "setting.png",
    role_identity:"setting",
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
      /*  {
        subtitle: "Menus",
        slug: "/setup/menus",
      }, */
      {
        subtitle: "Shipping",
        slug: "/shipping",
      },
    ],
  },
  {
    id: 16,
    title: "Staff",
    icon: "user.png",
    role_identity:"staff",
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


export const sidebarLinks = [
  ...commonLinks,
  ...allSidebarLinks.filter((link) =>
    userPermission?.includes(link.role_identity)
  ),
];