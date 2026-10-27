// Dữ liệu mô phỏng cao cấp theo đúng thiết kế Figma LUXE STORE
export const CATEGORIES = [
  {
    id: "ao",
    name: "Áo",
    slug: "ao",
    count: 38,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
    description: "Blazer cao cấp, áo sơ mi lụa và áo dệt kim tinh tế."
  },
  {
    id: "quan",
    name: "Quần",
    slug: "quan",
    count: 24,
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=800&auto=format&fit=crop",
    description: "Quần tây ống rộng xếp ly, quần suông thanh lịch."
  },
  {
    id: "vay",
    name: "Váy",
    slug: "vay",
    count: 31,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    description: "Đầm lụa midi dự tiệc, chân váy chữ A kinh điển."
  },
  {
    id: "phu-kien",
    name: "Phụ kiện",
    slug: "phu-kien",
    count: 42,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
    description: "Kính râm acetate, thắt lưng da bò thủ công."
  },
  {
    id: "giay-dep",
    name: "Giày dép",
    slug: "giay-dep",
    count: 19,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    description: "Sandal quai mảnh, mules tối giản và boots thời thượng."
  },
  {
    id: "tui-xach",
    name: "Túi xách",
    slug: "tui-xach",
    count: 16,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    description: "Túi da đeo vai cấu trúc hình khối cao cấp."
  }
];

export const PRODUCTS = [
  {
    id: "prod-1",
    name: "Áo Khoác Dạ Cấu Trúc Premium",
    category: "ao",
    categoryName: "Áo khoác & Blazer",
    price: 1590000,
    originalPrice: 1890000,
    discountPercent: 16,
    badge: "BÁN CHẠY",
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 128,
    soldCount: 350,
    stock: 15,
    colors: [
      { name: "Be", hex: "#D4C5B9" },
      { name: "Đen", hex: "#1F1F1F" },
      { name: "Ghi xám", hex: "#8E9196" }
    ],
    sizes: ["S", "M", "L", "XL"],
    brand: "LUXE STUDIO",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Áo khoác dạ cấu trúc cao cấp may từ chất liệu sợi len dệt pha lụa tự nhiên, giữ phom đứng chuẩn mực.",
    fullDesc: "Áo khoác dạ cấu trúc cao cấp được may từ chất liệu sợi len dệt pha lụa tự nhiên, mang lại cảm giác mềm mịn cùng khả năng giữ phom đứng chuẩn mực. Thiết kế ve áo vuông cổ điển cùng đường may xếp tỉ mỉ tạo điểm nhấn quyến rũ, phù hợp cho cả môi trường công sở lẫn các sự kiện sang trọng mùa thu đông.",
    material: "70% Wool tự nhiên, 20% Cashmere blend, 10% Silk lining chống tĩnh điện.",
    care: "Giặt khô chuyên dụng (Dry clean only). Treo trên móc gỗ bản to để giữ phom dáng vai áo."
  },
  {
    id: "prod-2",
    name: "Áo Blazer Linen Cấu Trúc",
    category: "ao",
    categoryName: "Áo Blazer & Vest",
    price: 1290000,
    originalPrice: 1500000,
    discountPercent: 15,
    badge: "-15%",
    isNew: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 94,
    soldCount: 210,
    stock: 22,
    colors: [
      { name: "Be cát", hex: "#E3DAC9" },
      { name: "Trắng ngà", hex: "#FDFBF7" },
      { name: "Xanh olive", hex: "#556B2F" }
    ],
    sizes: ["S", "M", "L"],
    brand: "Premium Linen",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Blazer vải linen dệt thô mộc cao cấp, phom suông nhẹ nhàng thoáng mát.",
    fullDesc: "Thiết kế hiện đại dành cho những ngày giao mùa. Chất liệu sợi lanh tự nhiên hữu cơ thân thiện làn da, thấm hút tối đa với kỹ thuật may đúp lót lụa cao cấp ở hai bên vạt áo.",
    material: "100% French Organic Linen dệt mật độ cao.",
    care: "Giặt tay nhẹ hoặc giặt máy chế độ nhẹ với túi giặt. Là hơi nước ở nhiệt độ vừa phải."
  },
  {
    id: "prod-3",
    name: "Quần Ống Rộng Xếp Ly Cao Cấp",
    category: "quan",
    categoryName: "Quần Tây / Pleated",
    price: 890000,
    originalPrice: 890000,
    discountPercent: 0,
    badge: "MỚI",
    isNew: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 86,
    soldCount: 190,
    stock: 30,
    colors: [
      { name: "Đen tuyền", hex: "#1A1A1A" },
      { name: "Kem", hex: "#F3EDE2" },
      { name: "Nâu đất", hex: "#7E5835" }
    ],
    sizes: ["S", "M", "L", "XL"],
    brand: "Modern Tailor",
    images: [
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Quần ống rộng dáng suông xếp ly đôi phía trước tạo hiệu ứng kéo dài đôi chân.",
    fullDesc: "Quần tây phom rộng thanh lịch với nếp gấp ly đôi phía trước tạo độ rủ mềm mại tự nhiên. Cạp cao tôn vòng eo, khóa kéo giấu kín mượt mà và túi xẻ tiện lợi.",
    material: "Chất liệu tuyết mưa dệt sợi nhân tạo cao cấp, co giãn nhẹ và không nhăn.",
    care: "Giặt máy ở nhiệt độ thường, phơi bóng râm để giữ màu vải luôn mới."
  },
  {
    id: "prod-4",
    name: "Đầm Lụa Midi Cổ Yếm",
    category: "vay",
    categoryName: "Đầm Lụa & Tiệc",
    price: 1450000,
    originalPrice: 1650000,
    discountPercent: 12,
    badge: "MỚI",
    isNew: true,
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 67,
    soldCount: 140,
    stock: 12,
    colors: [
      { name: "Đỏ đất", hex: "#8A3324" },
      { name: "Vàng champagne", hex: "#F7E7CE" },
      { name: "Đen", hex: "#111111" }
    ],
    sizes: ["S", "M", "L"],
    brand: "Heritage Silk",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Đầm lụa satin bóng nhẹ nhàng, cổ yếm quyến rũ khoe trọn bờ vai thanh mảnh.",
    fullDesc: "Đầm midi cổ yếm thắt nơ sau gáy kết hợp lưng trần gợi cảm. Đường cắt may xéo (bias-cut) ôm nhẹ theo từng chuyển động cơ thể mà vẫn giữ được sự kín đáo quý phái.",
    material: "Lụa tơ tằm nhân tạo dệt bóng satin mềm mượt.",
    care: "Giặt khô hoặc giặt nhẹ bằng sữa tắm dịu nhẹ, tránh vắt mạnh."
  },
  {
    id: "prod-5",
    name: "Túi Da Đeo Vai Cấu Trúc Khối",
    category: "tui-xach",
    categoryName: "Túi Da Thủ Công",
    price: 2100000,
    originalPrice: 2600000,
    discountPercent: 20,
    badge: "-20%",
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 142,
    soldCount: 420,
    stock: 8,
    colors: [
      { name: "Đen bóng", hex: "#121212" },
      { name: "Nâu hạt dẻ", hex: "#633A18" },
      { name: "Trắng sữa", hex: "#F5F5F0" }
    ],
    sizes: ["Tiêu chuẩn"],
    brand: "LUXE Leather",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Túi da cấu trúc hình hộp tối giản với khóa kim loại mạ vàng cao cấp.",
    fullDesc: "Được gia công thủ công từ da bò nguyên tấm xử lý chống xước và giữ phom chắc chắn. Dây đeo vai có thể tùy chỉnh độ dài linh hoạt từ đeo chéo đến kẹp nách sang trọng.",
    material: "100% Genuine Calfskin leather, phụ kiện đồng mạ vàng 18K phủ bóng chống oxy hóa.",
    care: "Lau sạch bằng khăn mềm ẩm, bảo quản trong túi dustbag khi không sử dụng."
  },
  {
    id: "prod-6",
    name: "Áo Sơmi Lụa Cổ V Premium",
    category: "ao",
    categoryName: "Áo Sơmi Lụa",
    price: 790000,
    originalPrice: 950000,
    discountPercent: 17,
    badge: "BÁN CHẠY",
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 110,
    soldCount: 520,
    stock: 25,
    colors: [
      { name: "Trắng ngà", hex: "#FDFCF7" },
      { name: "Xanh pastel", hex: "#A8BFC9" },
      { name: "Kem be", hex: "#E8DECB" }
    ],
    sizes: ["S", "M", "L", "XL"],
    brand: "LUXE Studio",
    images: [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Sơmi lụa suông cổ V thanh mảnh, mang đến sự chuyên nghiệp và mềm mại.",
    fullDesc: "Mẫu sơmi thiết yếu trong tủ đồ của quý cô hiện đại. Thiết kế cổ V mở vừa phải tôn đường xương quai xanh, hàng cúc ngọc trai tạo điểm nhấn cao cấp.",
    material: "Silk Crepe dệt mềm, ít nhăn và giữ màu bền đẹp.",
    care: "Ủi hơi nước mặt trái ở nhiệt độ thấp."
  },
  {
    id: "prod-7",
    name: "Chân Váy Chữ A Dáng Dài",
    category: "vay",
    categoryName: "Chân Váy Thiết Kế",
    price: 950000,
    originalPrice: 1100000,
    discountPercent: 14,
    badge: "BÁN CHẠY",
    isNew: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 75,
    soldCount: 280,
    stock: 18,
    colors: [
      { name: "Xám tro", hex: "#7A7E85" },
      { name: "Đen", hex: "#111111" },
      { name: "Nâu be", hex: "#C7B39B" }
    ],
    sizes: ["S", "M", "L"],
    brand: "Heritage Silk",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Chân váy chữ A tôn dáng với đường xẻ tà sau tạo chuyển động thanh thoát.",
    fullDesc: "Thiết kế chữ A cạp cao giấu bụng cực tốt, chiều dài qua bắp chân tạo dáng vẻ quý phái cổ điển. Phù hợp phối cùng blazer, áo len dệt kim hoặc sơ mi lụa.",
    material: "Vải đũi pha lụa dệt vân chìm cao cấp.",
    care: "Giặt tay nhẹ nhàng hoặc giặt khô."
  },
  {
    id: "prod-8",
    name: "Kính Râm Acetate Luxe",
    category: "phu-kien",
    categoryName: "Kính Mắt Thời Trang",
    price: 1150000,
    originalPrice: 1350000,
    discountPercent: 15,
    badge: "BÁN CHẠY",
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 58,
    soldCount: 310,
    stock: 14,
    colors: [
      { name: "Đồi mồi", hex: "#4A321E" },
      { name: "Đen tuyền", hex: "#141414" }
    ],
    sizes: ["Freesize"],
    brand: "LUXE Optical",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Gọng kính acetate cao cấp chống tia UV400, thiết kế góc cạnh cá tính.",
    fullDesc: "Được sản xuất từ phôi nhựa acetate thực vật từ Italy, bản lề 5 chấu mạ vàng bền bỉ, tròng kính polarized lọc ánh sáng xanh và chống lóa tuyệt đối.",
    material: "Italian Cellulose Acetate, tròng Polarized UV400 bảo vệ mắt.",
    care: "Lau bằng khăn vi sợi microfiber kèm theo hộp đựng bọc da."
  },
  {
    id: "prod-9",
    name: "Sandal Quai Mảnh Đế Thô",
    category: "giay-dep",
    categoryName: "Sandal & Giày",
    price: 980000,
    originalPrice: 1200000,
    discountPercent: 18,
    badge: "BÁN CHẠY",
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 63,
    soldCount: 220,
    stock: 16,
    colors: [
      { name: "Nâu da bò", hex: "#8A542A" },
      { name: "Trắng sữa", hex: "#F7F6F2" },
      { name: "Đen", hex: "#111111" }
    ],
    sizes: ["36", "37", "38", "39"],
    brand: "LUXE Studio",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Sandal quai da mảnh đế vuông cao 5cm êm ái, nâng niu đôi chân cả ngày dài.",
    fullDesc: "Mẫu sandal tối giản vượt thời gian. Quai mảnh thanh thoát ôm sát bàn chân, đế vuông bọc da chắc chắn mang lại cảm giác vững chãi và tự tin khi di chuyển.",
    material: "Da dê nhân tạo lót đệm cao su êm ái, đế phíp chống trơn trượt.",
    care: "Tránh ngâm nước, lau bằng bọt xốp chuyên dụng cho đồ da."
  },
  {
    id: "prod-10",
    name: "Áo Len Dệt Kim Cổ Lọ Tinh Giản",
    category: "ao",
    categoryName: "Áo Len & Dệt Kim",
    price: 850000,
    originalPrice: 980000,
    discountPercent: 13,
    badge: "MỚI",
    isNew: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 89,
    soldCount: 175,
    stock: 20,
    colors: [
      { name: "Trắng ngà", hex: "#FBF7ED" },
      { name: "Xám lông chuột", hex: "#6E7178" },
      { name: "Nâu socola", hex: "#3B2519" }
    ],
    sizes: ["S", "M", "L"],
    brand: "Modern Tailor",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Áo len cổ lọ dệt sợi merino siêu mịn, giữ ấm tốt và không gây ngứa.",
    fullDesc: "Chiếc áo dệt kim thiết yếu cho mùa thu đông. Cổ lọ gấp tinh tế, bo tay và gấu áo dệt gân tạo điểm nhấn ôm dáng gọn gàng.",
    material: "100% Sợi Merino Wool dệt kim mịn.",
    care: "Giặt tay nước lạnh, phơi ngang trên mặt phẳng để tránh dão áo."
  },
  {
    id: "prod-11",
    name: "Quần Jean Suông Ống Rộng Vintage",
    category: "quan",
    categoryName: "Quần Denim",
    price: 790000,
    originalPrice: 890000,
    discountPercent: 11,
    badge: "HOT",
    isNew: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 52,
    soldCount: 160,
    stock: 35,
    colors: [
      { name: "Xanh vintage", hex: "#4C6B8B" },
      { name: "Xanh nhạt", hex: "#8DA7C0" }
    ],
    sizes: ["26", "27", "28", "29", "30"],
    brand: "LUXE Studio",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Jean denim 100% cotton mộc cạp cao tôn dáng phong cách Parisian chic.",
    fullDesc: "Form quần suông rộng thoải mái lấy cảm hứng từ thập niên 90. Xử lý màu giặt tự nhiên không dùng hóa chất độc hại, càng mặc càng mềm mại.",
    material: "100% Cotton Denim không co giãn giữ phom bền bỉ.",
    care: "Lộn trái khi giặt, giặt cùng đồ cùng màu."
  },
  {
    id: "prod-12",
    name: "Thắt Lưng Da Bò Khóa Mạ Vàng",
    category: "phu-kien",
    categoryName: "Thắt Lưng",
    price: 490000,
    originalPrice: 590000,
    discountPercent: 17,
    badge: "HOT",
    isNew: false,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 95,
    soldCount: 380,
    stock: 40,
    colors: [
      { name: "Đen", hex: "#111111" },
      { name: "Nâu sẫm", hex: "#4A2E16" }
    ],
    sizes: ["85cm", "90cm", "95cm"],
    brand: "LUXE Leather",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop"
    ],
    shortDesc: "Thắt lưng da bò thật bản 2.5cm thanh mảnh với khóa hợp kim mạ vàng mờ.",
    fullDesc: "Điểm nhấn hoàn hảo cho cả quần tây công sở lẫn váy đầm thắt eo. Chất liệu da bò nhập khẩu với đường may viền tỉ mỉ bằng chỉ sáp.",
    material: "Da bò Mill tự nhiên nguyên miếng, mặt khóa mạ PVD chống bay màu.",
    care: "Tránh tiếp xúc hóa chất tẩy rửa mạnh."
  }
];

export const VOUCHERS = [
  { code: "LUXE2026", discount: 15, maxDiscount: 300000, minOrder: 800000, desc: "Giảm 15% tối đa 300.000đ cho đơn từ 800.000đ" },
  { code: "FREESHIP", discount: 100, isShipping: true, minOrder: 500000, desc: "Miễn phí vận chuyển toàn quốc cho đơn từ 500.000đ" },
  { code: "WELCOME10", discount: 10, maxDiscount: 150000, minOrder: 0, desc: "Giảm 10% cho khách hàng mới" }
];

export const MOCK_ORDERS = [
  {
    id: "ORD-92811",
    date: "10/10/2026",
    status: "Đang giao hàng",
    statusCode: "shipping",
    total: 2480000,
    paymentMethod: "Chuyển khoản VietQR",
    items: [
      {
        name: "Áo Khoác Dạ Cấu Trúc Premium",
        size: "M",
        color: "Be",
        quantity: 1,
        price: 1590000,
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop"
      },
      {
        name: "Quần Ống Rộng Xếp Ly Cao Cấp",
        size: "S",
        color: "Kem",
        quantity: 1,
        price: 890000,
        image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=300&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "ORD-87142",
    date: "28/09/2026",
    status: "Đã giao thành công",
    statusCode: "delivered",
    total: 2100000,
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    items: [
      {
        name: "Túi Da Đeo Vai Cấu Trúc Khối",
        size: "Tiêu chuẩn",
        color: "Đen bóng",
        quantity: 1,
        price: 2100000,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300&auto=format&fit=crop"
      }
    ]
  }
];

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
