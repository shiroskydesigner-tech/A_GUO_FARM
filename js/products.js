// goUrl：從 ccat 黑貓GO物車後台拿到的「商品專屬短網址」貼進來即可。
// 填了 goUrl 的商品，前台會顯示「立即訂購」按鈕，點了直接跳到 ccat 結帳。
// 留空（""）的商品，會維持原本的「加入購物袋」按鈕，方便分批上架。
window.PRODUCTS = [
  {
    id: "lychee-2025",
    name: "本季荔枝",
    nameEn: "This season's lychee",
    price: 580,
    unit: "盒",
    image: "images/products/lychee-gift.jpg",
    description: "一次採收，不分級、不修飾。大小、色差、斑點與成熟差異皆保留。建議冷藏、盡早食用。",
    specs: ["Harvested once", "No grading", "No correction", "Seasonal only"],
    goUrl: ""
  },
  {
    id: "lychee-gift",
    name: "禮盒裝",
    nameEn: "Gift box",
    price: 980,
    unit: "盒",
    image: "images/products/lychee-gift.jpg",
    description: "精選當季荔枝，禮盒包裝。數量有限，售完即止。",
    specs: ["Harvested once", "Gift packaging", "Seasonal only"],
    goUrl: ""
  },
  {
    id: "lychee-small",
    name: "小份裝",
    nameEn: "Small portion",
    price: 380,
    unit: "盒",
    image: "images/products/lychee-gift.jpg",
    description: "適合小家庭或獨享。一次採收、不分級，當季鮮採。",
    specs: ["Harvested once", "Small portion", "Seasonal only"],
    goUrl: ""
  },
  {
    id: "lychee-large",
    name: "大份裝",
    nameEn: "Large portion",
    price: 780,
    unit: "盒",
    image: "images/products/lychee-gift.jpg",
    description: "份量加倍，分享更盡興。建議冷藏、盡早食用。",
    specs: ["Harvested once", "Large portion", "Seasonal only"],
    goUrl: ""
  },
  {
    id: "lychee-double",
    name: "雙盒組",
    nameEn: "Double box set",
    price: 1100,
    unit: "組",
    image: "images/products/lychee-gift.jpg",
    description: "兩盒本季荔枝優惠組。送禮自用兩相宜。",
    specs: ["Harvested once", "Two boxes", "Seasonal only"],
    goUrl: ""
  },
  {
    id: "lychee-trial",
    name: "試吃組",
    nameEn: "Trial pack",
    price: 280,
    unit: "盒",
    image: "images/products/lychee-gift.jpg",
    description: "少量體驗當季風味。數量有限。",
    specs: ["Harvested once", "Trial size", "Seasonal only"],
    goUrl: ""
  }
];
