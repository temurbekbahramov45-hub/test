"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Phone, Check, ShoppingCart, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  price: number;
  image?: string;
  category: string;
  discount?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderData {
  deliveryAddress: string;
  paymentMethod: string;
  customerPhone?: string;
}

export default function Home() {
  const [language, setLanguage] = useState<"uz" | "ru">("uz");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderData, setOrderData] = useState<OrderData>({
    deliveryAddress: "Xorazm viloyati Xonqa Tumani Halq Banki yonida",
    paymentMethod: "Naqd pul",
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    nameUz: "",
    nameRu: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    discount: 0,
    hasDiscount: false,
  });
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      nameUz: "Hotdog 5 tasi 1 da",
      nameRu: "Хотдог 5 штук 1 шт",
      price: 25000,
      category: "Hotdog",
      discount: 0,
    },
    {
      id: "2",
      nameUz: "Hotdog 5 tasi 1 da (Big)",
      nameRu: "Хотдог 5 штук 1 шт (Большой)",
      price: 35000,
      category: "Hotdog",
      discount: 0,
    },
    {
      id: "3",
      nameUz: "Gamburger 5 tasi 1 da",
      nameRu: "Гамбургер 5 штук 1 шт",
      price: 30000,
      category: "Burger",
      discount: 0,
    },
    {
      id: "4",
      nameUz: "Chicken Burger 5 tasi 1 da",
      nameRu: "Чикен Бургер 5 штук 1 шт",
      price: 32000,
      category: "Burger",
      discount: 0,
    },
    {
      id: "5",
      nameUz: "Gamburger",
      nameRu: "Гамбургер",
      price: 25000,
      category: "Burger",
      discount: 10,
    },
    {
      id: "6",
      nameUz: "DablBurger",
      nameRu: "ДаблБургер",
      price: 35000,
      category: "Burger",
      discount: 0,
    },
    {
      id: "7",
      nameUz: "Chizburger",
      nameRu: "Чизбургер",
      price: 28000,
      category: "Burger",
      discount: 0,
    },
    {
      id: "8",
      nameUz: "DablChizburger",
      nameRu: "ДаблЧизбургер",
      price: 38000,
      category: "Burger",
      discount: 0,
    },
    {
      id: "9",
      nameUz: "ChickenDog 5 tasi 1 da",
      nameRu: "ЧикенДог 5 штук 1 шт",
      price: 30000,
      category: "Hotdog",
      discount: 0,
    },
    {
      id: "10",
      nameUz: "Hot-Dog",
      nameRu: "Хот-Дог",
      price: 20000,
      category: "Hotdog",
      discount: 0,
    },
    {
      id: "11",
      nameUz: "Hot-Dog (big)",
      nameRu: "Хот-Дог (большой)",
      price: 28000,
      category: "Hotdog",
      discount: 0,
    },
    {
      id: "12",
      nameUz: "Kartoshka Fri",
      nameRu: "Картошка Фри",
      price: 15000,
      category: "Side",
      discount: 0,
    },
    {
      id: "13",
      nameUz: "Coca Cola 0.5",
      nameRu: "Кока Кола 0.5",
      price: 8000,
      category: "Drink",
      discount: 0,
    },
    {
      id: "14",
      nameUz: "ChickenBurger",
      nameRu: "ЧикенБургер",
      price: 26000,
      category: "Burger",
      discount: 0,
    },
    {
      id: "15",
      nameUz: "IceCoffee",
      nameRu: "АйсКофе",
      price: 12000,
      category: "Drink",
      discount: 0,
    },
    {
      id: "16",
      nameUz: "Klab Sendwich",
      nameRu: "Клаб Сэндвич",
      price: 30000,
      category: "Sandwich",
      discount: 0,
    },
    {
      id: "17",
      nameUz: "Klab Sendwich Fri bilan",
      nameRu: "Клаб Сэндвич с Фри",
      price: 35000,
      category: "Combo",
      discount: 0,
    },
    {
      id: "18",
      nameUz: "Fri va Cola",
      nameRu: "Фри и Кола",
      price: 20000,
      category: "Combo",
      discount: 0,
    },
    {
      id: "19",
      nameUz: "Naggets 4",
      nameRu: "Наггетсы 4",
      price: 18000,
      category: "Chicken",
      discount: 0,
    },
    {
      id: "20",
      nameUz: "Naggets 8",
      nameRu: "Наггетсы 8",
      price: 32000,
      category: "Chicken",
      discount: 0,
    },
    {
      id: "21",
      nameUz: "Strips",
      nameRu: "Стрипсы",
      price: 25000,
      category: "Chicken",
      discount: 0,
    },
    {
      id: "22",
      nameUz: "Moxito Classic",
      nameRu: "Мохито Классик",
      price: 15000,
      category: "Drink",
      discount: 0,
    },
    {
      id: "23",
      nameUz: "Combo 2",
      nameRu: "Комбо 2",
      price: 45000,
      category: "Combo",
      discount: 0,
    },
    {
      id: "24",
      nameUz: "Chizburger set 4",
      nameRu: "Чизбургер сет 4",
      price: 95000,
      category: "Combo",
      discount: 0,
    },
    {
      id: "25",
      nameUz: "Gigant Hot-Dog",
      nameRu: "Гигант Хот-Дог",
      price: 40000,
      category: "Hotdog",
      discount: 0,
    },
    {
      id: "26",
      nameUz: "Ice-Tea",
      nameRu: "Айс-Ти",
      price: 10000,
      category: "Drink",
      discount: 0,
    },
  ]);

  const { toast } = useToast();

  const texts = {
    uz: {
      title: "DendyFood",
      addToCart: "Qo'shish",
      removeFromCart: "Olib tashlash",
      totalPrice: "Jami summa:",
      placeOrder: "Buyurtma berish",
      orderSuccess: "Sizning buyurtmangiz qabul qilindi. 30–35 daqiqa ichida yetkazib beriladi.",
      deliveryAddress: "Yetkazib berish manzili:",
      paymentMethod: "To'lov usuli:",
      cashPayment: "Naqd pul",
      cardPayment: "Karta orqali",
      cardInfo: "Karta raqamiga pul tashlang: 9860 3501 4506 8143. Otabek Narimanov",
      callUs: "Telefon qilish",
      admin: "Admin",
      username: "Foydalanuvchi nomi",
      password: "Parol",
      login: "Kirish",
      addProduct: "Mahsulot qo'shish",
      productNameUz: "Mahsulot nomi (Uzbek)",
      productNameRu: "Mahsulot nomi (Rus)",
      productPrice: "Narxi",
      productCategory: "Kategoriya",
      hasDiscount: "Chegirma qo'shasizmi?",
      yes: "Ha",
      no: "Yo'q",
      discountPercent: "Chegirma foizi",
      save: "Saqlash",
      cancel: "Bekor qilish",
      edit: "Tahrirlash",
      delete: "O'chirish",
      categories: {
        Hotdog: "Hotdog",
        Burger: "Burger",
        Side: "Qo'shimchalar",
        Drink: "Ichimliklar",
        Sandwich: "Sendvichlar",
        Combo: "Kombo",
        Chicken: "Tovuq",
      },
    },
    ru: {
      title: "DendyFood",
      addToCart: "Добавить",
      removeFromCart: "Удалить",
      totalPrice: "Итого:",
      placeOrder: "Оформить заказ",
      orderSuccess: "Ваш заказ принят. Будет доставлен в течение 30–35 минут.",
      deliveryAddress: "Адрес доставки:",
      paymentMethod: "Способ оплаты:",
      cashPayment: "Наличные",
      cardPayment: "Картой",
      cardInfo: "Переведите деньги на номер карты: 9860 3501 4506 8143. Отабек Нариманов",
      callUs: "Позвонить",
      admin: "Админ",
      username: "Имя пользователя",
      password: "Пароль",
      login: "Войти",
      addProduct: "Добавить товар",
      productNameUz: "Название товара (Узбекский)",
      productNameRu: "Название товара (Русский)",
      productPrice: "Цена",
      productCategory: "Категория",
      hasDiscount: "Добавить скидку?",
      yes: "Да",
      no: "Нет",
      discountPercent: "Процент скидки",
      save: "Сохранить",
      cancel: "Отмена",
      edit: "Редактировать",
      delete: "Удалить",
      categories: {
        Hotdog: "Хотдог",
        Burger: "Бургер",
        Side: "Дополнения",
        Drink: "Напитки",
        Sandwich: "Сэндвичи",
        Combo: "Комбо",
        Chicken: "Курица",
      },
    },
  };

  const t = texts[language];

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter((item) => item.product.id !== productId);
      }
    });
  };

  const getQuantityInCart = (productId: string) => {
    const item = cart.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.product.discount
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: language === "uz" ? "Xatolik" : "Ошибка",
        description: language === "uz" ? "Savat bo'sh" : "Корзина пуста",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send message to Telegram
      const telegramMessage = `🍔 YANGI BUYURTMA!
📞 Telefon: ${orderData.customerPhone || "Ko'rsatilmagan"}
💰 To'lov usuli: ${orderData.paymentMethod}
📊 Jami summa: ${getTotalPrice().toLocaleString()} so'm
🛒 Buyurtma mahsulotlari:
${cart
  .map(
    (item) =>
      `${language === "uz" ? item.product.nameUz : item.product.nameRu} — ${item.quantity} x ${(
        item.product.discount
          ? item.product.price * (1 - item.product.discount / 100)
          : item.product.price
      ).toLocaleString()} so'm = ${(
        (item.product.discount
          ? item.product.price * (1 - item.product.discount / 100)
          : item.product.price) * item.quantity
      ).toLocaleString()} so'm`
  )
  .join("\n")}
📍 Manzil: ${orderData.deliveryAddress}
⏰ Vaqt: ${new Date().toLocaleString("uz-UZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      // Send to Telegram group
      await fetch(
        `https://api.telegram.org/bot8410799225:AAEkdfVuxr56XGUiqoTesMBW6lrcGIA2rOY/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: "-4883792073",
            text: telegramMessage,
          }),
        }
      );

      setIsOrderPlaced(true);
      setCart([]);
      toast({
        title: language === "uz" ? "Muvaffaqiyatli" : "Успешно",
        description: t.orderSuccess,
      });

      // Reset order placed status after 5 seconds
      setTimeout(() => setIsOrderPlaced(false), 5000);
    } catch (error) {
      toast({
        title: language === "uz" ? "Xatolik" : "Ошибка",
        description: language === "uz" ? "Buyurtma jo'natilmadi" : "Заказ не отправлен",
        variant: "destructive",
      });
    }
  };

  const handleAdminLogin = () => {
    if (
      adminCredentials.username === "dendyuz" &&
      adminCredentials.password === "parolyoq"
    ) {
      setIsAdminLoggedIn(true);
      toast({
        title: language === "uz" ? "Muvaffaqiyatli" : "Успешно",
        description: language === "uz" ? "Admin paneliga kirildi" : "Вход в админ панель выполнен",
      });
    } else {
      toast({
        title: language === "uz" ? "Xatolik" : "Ошибка",
        description: language === "uz" ? "Noto'g'ri login yoki parol" : "Неверный логин или пароль",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = () => {
  if (newProduct.nameUz && newProduct.nameRu && newProduct.price > 0) {
    const product: Product = {
      id: Date.now().toString(),
      nameUz: newProduct.nameUz,
      nameRu: newProduct.nameRu,
      description: newProduct.description,
      price: newProduct.price,
      category: newProduct.category,
      image: newProduct.image,
      discount: newProduct.hasDiscount ? newProduct.discount : 0,
    };

    // Yangilangan ro'yxat
    const updatedProducts = [...products, product];

    // State'ni yangilash
    setProducts(updatedProducts);

    // LocalStorage'ga yozish
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // Formani tozalash
    setNewProduct({
      nameUz: "",
      nameRu: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      discount: 0,
      hasDiscount: false,
    });

    // Qo'shish oynasini yopish
    setShowAddProduct(false);

    // Toast xabar
    toast({
      title: language === "uz" ? "Muvaffaqiyatli" : "Успешно",
      description:
        language === "uz"
          ? "Mahsulot qo'shildi va asosiy sahifada ko'rinadi"
          : "Товар добавлен и виден на главной странице",
    });
  }
};


  const handleEditProduct = () => {
    if (editingProduct && newProduct.nameUz && newProduct.nameRu && newProduct.price > 0) {
      const updatedProduct: Product = {
        ...editingProduct,
        nameUz: newProduct.nameUz,
        nameRu: newProduct.nameRu,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image,
        discount: newProduct.hasDiscount ? newProduct.discount : 0,
      };
      
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setEditingProduct(null);
      setNewProduct({
        nameUz: "",
        nameRu: "",
        description: "",
        price: 0,
        category: "",
        image: "",
        discount: 0,
        hasDiscount: false,
      });
      toast({
        title: language === "uz" ? "Muvaffaqiyatli" : "Успешно",
        description: language === "uz" ? "Mahsulot yangilandi" : "Товар обновлен",
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    toast({
      title: language === "uz" ? "Muvaffaqiyatli" : "Успешно",
      description: language === "uz" ? "Mahsulot o'chirildi" : "Товар удален",
    });
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/dendyfood-logo.png"
                alt="DendyFood Logo"
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-3xl font-bold text-orange-600">{t.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {language === "uz" ? "Savat" : "Корзина"}
                    {cart.length > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{language === "uz" ? "Savatdagi mahsulotlar" : "Товары в корзине"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        {language === "uz" ? "Savat bo'sh" : "Корзина пуста"}
                      </p>
                    ) : (
                      <>
                        <div className="max-h-64 overflow-y-auto space-y-3">
                          {cart.map((item) => {
                            const discountedPrice = item.product.discount
                              ? item.product.price * (1 - item.product.discount / 100)
                              : item.product.price;
                            
                            return (
                              <div key={item.product.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                  <h4 className="font-medium">
                                    {language === "uz" ? item.product.nameUz : item.product.nameRu}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    {item.product.discount > 0 && (
                                      <>
                                        <span className="text-sm text-gray-500 line-through">
                                          {item.product.price.toLocaleString()} so'm
                                        </span>
                                        <Badge variant="destructive" className="text-xs">
                                          -{item.product.discount}%
                                        </Badge>
                                      </>
                                    )}
                                    <span className="font-bold text-orange-600">
                                      {discountedPrice.toLocaleString()} so'm
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeFromCart(item.product.id)}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="font-medium">{item.quantity}</span>
                                    <Button
                                      size="sm"
                                      onClick={() => addToCart(item.product)}
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <Separator />
                        
                        {/* Order Details */}
                        <div className="space-y-4">
                          <div>
                            <Label className="text-base font-medium">
                              {language === "uz" ? "Telefon raqamingiz" : "Ваш номер телефона"}
                            </Label>
                            <Input
                              value={orderData.customerPhone || ""}
                              onChange={(e) =>
                                setOrderData({
                                  ...orderData,
                                  customerPhone: e.target.value,
                                })
                              }
                              className="mt-1"
                              placeholder={language === "uz" ? "+998 XX XXX XX XX" : "+998 XX XXX XX XX"}
                              type="tel"
                            />
                          </div>

                          <div>
                            <Label className="text-base font-medium">
                              {t.deliveryAddress}
                            </Label>
                            <Input
                              value={orderData.deliveryAddress}
                              onChange={(e) =>
                                setOrderData({
                                  ...orderData,
                                  deliveryAddress: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-base font-medium">
                              {t.paymentMethod}
                            </Label>
                            <RadioGroup
                              value={orderData.paymentMethod}
                              onValueChange={(value) =>
                                setOrderData({ ...orderData, paymentMethod: value })
                              }
                              className="mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Naqd pul" id="cash-cart" />
                                <Label htmlFor="cash-cart">{t.cashPayment}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Karta orqali" id="card-cart" />
                                <Label htmlFor="card-cart">{t.cardPayment}</Label>
                              </div>
                            </RadioGroup>
                            {orderData.paymentMethod === "Karta orqali" && (
                              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">{t.cardInfo}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator />
                        <div className="flex items-center justify-between font-bold text-lg">
                          <span>{t.totalPrice}</span>
                          <span className="text-orange-600">
                            {getTotalPrice().toLocaleString()} so'm
                          </span>
                        </div>
                        <Button 
                          onClick={handlePlaceOrder}
                          disabled={cart.length === 0 || isOrderPlaced}
                          className="w-full mt-4"
                          size="lg"
                        >
                          {isOrderPlaced ? (
                            <Check className="w-5 h-5 mr-2" />
                          ) : (
                            <ShoppingCart className="w-5 h-5 mr-2" />
                          )}
                          {t.placeOrder}
                        </Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setLanguage("uz")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    language === "uz"
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  UZ
                </button>
                <button
                  onClick={() => setLanguage("ru")}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    language === "ru"
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  RU
                </button>
              </div>
              <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {t.admin}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t.admin}</DialogTitle>
                  </DialogHeader>
                  {!isAdminLoggedIn ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">{t.username}</Label>
                        <Input
                          id="username"
                          value={adminCredentials.username}
                          onChange={(e) =>
                            setAdminCredentials({
                              ...adminCredentials,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">{t.password}</Label>
                        <Input
                          id="password"
                          type="password"
                          value={adminCredentials.password}
                          onChange={(e) =>
                            setAdminCredentials({
                              ...adminCredentials,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button onClick={handleAdminLogin} className="w-full">
                        {t.login}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        onClick={() => setShowAddProduct(true)}
                        className="w-full"
                      >
                        {t.addProduct}
                      </Button>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{product.nameUz}</div>
                              <div className="text-sm text-gray-600">
                                {product.nameRu}
                              </div>
                              {product.description && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {product.description}
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-medium">
                                  {product.price.toLocaleString()} so'm
                                </span>
                                {product.discount > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    -{product.discount}%
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {t.categories[product.category as keyof typeof t.categories] || product.category}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setNewProduct({
                                    nameUz: product.nameUz,
                                    nameRu: product.nameRu,
                                    description: product.description || "",
                                    price: product.price,
                                    category: product.category,
                                    image: product.image || "",
                                    discount: product.discount || 0,
                                    hasDiscount: (product.discount || 0) > 0,
                                  });
                                }}
                              >
                                {t.edit}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                {t.delete}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Product Catalog */}
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t.categories[category as keyof typeof t.categories] || category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryProducts.map((product) => {
                  const quantityInCart = getQuantityInCart(product.id);
                  const discountedPrice = product.discount
                    ? product.price * (1 - product.discount / 100)
                    : product.price;

                  return (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={language === "uz" ? product.nameUz : product.nameRu}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `<div class="text-gray-400 text-sm">${language === "uz" ? "Rasm" : "Фото"}</div>`;
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 text-sm">
                              {language === "uz" ? "Rasm" : "Фото"}
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                          {language === "uz" ? product.nameUz : product.nameRu}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mb-4">
                          {product.discount > 0 && (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                {product.price.toLocaleString()} so'm
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                -{product.discount}%
                              </Badge>
                            </>
                          )}
                          <span className="text-lg font-bold text-orange-600">
                            {discountedPrice.toLocaleString()} so'm
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(product.id)}
                            disabled={quantityInCart === 0}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-medium">{quantityInCart}</span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add/Edit Product Dialog */}
      <Dialog open={showAddProduct || editingProduct !== null} onOpenChange={(open) => {
        if (!open) {
          setShowAddProduct(false);
          setEditingProduct(null);
          setNewProduct({
            nameUz: "",
            nameRu: "",
            description: "",
            price: 0,
            category: "",
            image: "",
            discount: 0,
            hasDiscount: false,
          });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? (language === "uz" ? "Mahsulotni tahrirlash" : "Редактировать товар") : t.addProduct}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nameUz">{t.productNameUz}</Label>
                <Input
                  id="nameUz"
                  value={newProduct.nameUz}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, nameUz: e.target.value })
                  }
                  placeholder={language === "uz" ? "Mahsulot nomini kiriting" : "Введите название товара"}
                />
              </div>
              <div>
                <Label htmlFor="nameRu">{t.productNameRu}</Label>
                <Input
                  id="nameRu"
                  value={newProduct.nameRu}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, nameRu: e.target.value })
                  }
                  placeholder={language === "uz" ? "Mahsulot nomini kiriting" : "Введите название товара"}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">{language === "uz" ? "Mahsulot tavsifi" : "Описание товара"}</Label>
              <Input
                id="description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder={language === "uz" ? "Mahsulot haqida qisqacha ma'lumot" : "Краткое описание товара"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">{t.productPrice}</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="100"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="category">{t.productCategory}</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  placeholder={language === "uz" ? "Kategoriya nomi" : "Название категории"}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">{language === "uz" ? "Rasm URL" : "URL изображения"}</Label>
              <Input
                id="image"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.value })
                }
                placeholder={language === "uz" ? "Rasm havolasi (ixtiyoriy)" : "URL изображения (необязательно)"}
              />
            </div>

            <div>
              <Label>{t.hasDiscount}</Label>
              <RadioGroup
                value={newProduct.hasDiscount ? "yes" : "no"}
                onValueChange={(value) =>
                  setNewProduct({
                    ...newProduct,
                    hasDiscount: value === "yes",
                  })
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="discountYes" />
                  <Label htmlFor="discountYes">{t.yes}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="discountNo" />
                  <Label htmlFor="discountNo">{t.no}</Label>
                </div>
              </RadioGroup>
              {newProduct.hasDiscount && (
                <div className="mt-2">
                  <Label htmlFor="discount">{t.discountPercent}</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={newProduct.discount}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        discount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={editingProduct ? handleEditProduct : handleAddProduct} 
                className="flex-1"
                disabled={!newProduct.nameUz || !newProduct.nameRu || newProduct.price <= 0}
              >
                {editingProduct ? (language === "uz" ? "Saqlash" : "Сохранить") : t.save}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                  setNewProduct({
                    nameUz: "",
                    nameRu: "",
                    description: "",
                    price: 0,
                    category: "",
                    image: "",
                    discount: 0,
                    hasDiscount: false,
                  });
                }}
                className="flex-1"
              >
                {t.cancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}