
import { useEffect, useState } from 'react'
import { trackEvent, trackPageView } from './analytics/analytics'
import AnalyticsDashboard from './AnalyticsDashboard'
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  UtensilsCrossed,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Trash2,
} from 'lucide-react'
import './App.css'

const menuItems = [
  {
    id: 1,
    name: 'Classic Burger',
    category: 'Burgers',
    price: 249,
    rating: 4.8,
    time: '20 min',
    description: 'Juicy grilled patty, lettuce, tomato and house sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop',
    popular: true,
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 329,
    rating: 4.7,
    time: '25 min',
    description: 'Classic mozzarella, tomato sauce and fresh basil.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop',
    popular: true,
  },
  {
    id: 3,
    name: 'Crispy French Fries',
    category: 'Sides',
    price: 129,
    rating: 4.6,
    time: '12 min',
    description: 'Golden, crispy fries seasoned to perfection.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop',
    popular: false,
  },
  {
    id: 4,
    name: 'Chicken Burger',
    category: 'Burgers',
    price: 289,
    rating: 4.9,
    time: '20 min',
    description: 'Crispy chicken, fresh greens and creamy mayo.',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop',
    popular: true,
  },
  {
    id: 5,
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    price: 399,
    rating: 4.8,
    time: '25 min',
    description: 'Loaded with cheese and delicious pepperoni.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop',
    popular: false,
  },
  {
    id: 6,
    name: 'Cold Coffee',
    category: 'Drinks',
    price: 149,
    rating: 4.5,
    time: '5 min',
    description: 'Smooth, chilled coffee topped with creamy foam.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop',
    popular: false,
  },
  {
    id: 7,
    name: 'Fresh Garden Salad',
    category: 'Sides',
    price: 179,
    rating: 4.6,
    time: '10 min',
    description: 'Fresh greens, cherry tomatoes and house dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop',
    popular: false,
  },
  {
    id: 8,
    name: 'Fresh Lemonade',
    category: 'Drinks',
    price: 99,
    rating: 4.5,
    time: '5 min',
    description: 'Refreshing lemonade with fresh mint.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=600&auto=format&fit=crop',
    popular: false,
  },
]

const categories = ['All items', 'Burgers', 'Pizza', 'Sides', 'Drinks']

function App() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [category, setCategory] = useState('All items')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  useEffect(() => {
  trackPageView()
}, [])

  const filteredItems =
    category === 'All items'
      ? menuItems
      : menuItems.filter((item) => item.category === category)

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const deliveryFee = subtotal > 0 ? 30 : 0
  const total = subtotal + deliveryFee

  
function addToCart(product) {
  setCart((currentCart) => {
    const existing = currentCart.find((item) => item.id === product.id)

    if (existing) {
      return currentCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    }

    return [...currentCart, { ...product, quantity: 1 }]
  })

  trackEvent('add_to_cart', {
    product_id: product.id,
    product_name: product.name,
    category: product.category,
    price: product.price,
  })
}


  function updateQuantity(id, change) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function placeOrder(event) {
    event.preventDefault()

    if (!cart.length) return

    const newOrderNumber = `UB${Date.now().toString().slice(-6)}`
    trackEvent('checkout_started', {
      item_count: cart.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: total,
    })
    // This is a demo order. Later, send it to the Laravel API.
    console.log('Restaurant order:', {
      orderNumber: newOrderNumber,
      customer,
      items: cart,
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toISOString(),
    })
    trackEvent('order_created', {
      order_number: newOrderNumber,
      item_count: cart.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: total,
      currency: 'INR',
    })
    setOrderNumber(newOrderNumber)
    setOrderSuccess(true)
    setCheckoutOpen(false)
    setCartOpen(false)
    setCart([])
    setCustomer({ name: '', phone: '', address: '' })
  }

  function scrollToMenu() {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }


  return (
    <>
    <div style={{ padding: '12px 20px', background: '#20283b' }}>
      <button
        onClick={() => setShowDashboard(false)}
        style={{ marginRight: 10 }}
      >
        Restaurant
      </button>

      <button onClick={() => setShowDashboard(true)}>
        Analytics Dashboard
      </button>
    </div>

    {showDashboard ? (
      <AnalyticsDashboard />
    ) : (
    <div className="restaurant-app">
      <header className="restaurant-navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">
            <UtensilsCrossed size={23} />
          </span>
          <span>
            Urban<span className="brand-accent">Bites</span>
            <small>FRESH FOOD, HAPPY MOOD</small>
          </span>
        </a>

        <nav className="desktop-nav">
          <a href="#home">Home</a>
          <a href="#menu">Our Menu</a>
          <a href="#about">About Us</a>
        </nav>

        <button className="cart-button" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={18} />
          <span>My Cart</span>
          <span className="cart-badge">{cartCount}</span>
        </button>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              GOOD FOOD, MADE FRESH
            </span>

            <h1>
              Good food.
              <br />
              <span>Good mood.</span>
            </h1>

            <p>
              Delicious food made with fresh ingredients, prepared with love
              and delivered straight to your table.
            </p>

            <div className="hero-actions">
              <button className="primary-button" onClick={scrollToMenu}>
                Explore Our Menu <ArrowRight size={18} />
              </button>
              <div className="rating-summary">
                <span className="rating-stars">★★★★★</span>
                <span>4.8/5 customer rating</span>
              </div>
            </div>

            <div className="hero-features">
              <div>
                <Clock size={19} />
                <span>Quick preparation</span>
              </div>
              <div>
                <Star size={19} />
                <span>Fresh ingredients</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop"
              alt="Freshly prepared burger"
            />
            <div className="hero-image-label">
              <span className="label-icon">✦</span>
              <div>
                <strong>Made fresh daily</strong>
                <small>Quality you can taste</small>
              </div>
            </div>
            <div className="hero-orange-circle" />
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div>
              <span className="section-kicker">WHAT WE SERVE</span>
              <h2>Explore our menu</h2>
              <p>Find your new favourite, made fresh just for you.</p>
            </div>
            <span className="menu-item-count">
              {filteredItems.length} delicious choices
            </span>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={`category-button ${
                  category === item ? 'active' : ''
                }`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="food-grid">
            {filteredItems.map((item) => {
              const cartItem = cart.find((food) => food.id === item.id)

              return (
                <article className="food-card" key={item.id}>
                  <div className="food-image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="food-image"
                      loading="lazy"
                    />
                    {item.popular && (
                      <span className="popular-badge">POPULAR</span>
                    )}
                    <button
                      className="add-food-button"
                      onClick={() => addToCart(item)}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      {cartItem ? <CheckCircle size={20} /> : <Plus size={21} />}
                    </button>
                  </div>

                  <div className="food-card-content">
                    <div className="food-meta">
                      <span className="food-category">{item.category}</span>
                      <span className="food-rating">
                        <Star size={14} fill="currentColor" />
                        {item.rating}
                      </span>
                    </div>

                    <h3>{item.name}</h3>
                    <p>{item.description}</p>

                    <div className="food-card-footer">
                      <strong>₹{item.price}</strong>
                      <span>
                        <Clock size={14} /> {item.time}
                      </span>
                    </div>

                    {cartItem && (
                      <div className="added-message">
                        {cartItem.quantity} in your cart
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="about-section" id="about">
          <div>
            <span className="section-kicker">OUR PROMISE</span>
            <h2>Simple ingredients. Extraordinary flavour.</h2>
          </div>
          <p>
            At Urban Bites, we believe good food brings people together. Every
            order is prepared fresh and served with care.
          </p>
        </section>
      </main>

      <footer className="restaurant-footer">
        <a href="#home" className="brand footer-brand">
          <span className="brand-icon">
            <UtensilsCrossed size={20} />
          </span>
          <span>
            Urban<span className="brand-accent">Bites</span>
          </span>
        </a>
        <span>Fresh food, happy mood. © {new Date().getFullYear()} Urban Bites</span>
      </footer>

      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-panel" onClick={(event) => event.stopPropagation()}>
            <div className="panel-heading">
              <div>
                <span className="section-kicker">YOUR SELECTION</span>
                <h2>Your cart ({cartCount})</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={45} />
                <h3>Your cart is empty</h3>
                <p>Add something delicious from our menu.</p>
                <button
                  className="primary-button"
                  onClick={() => setCartOpen(false)}
                >
                  Explore menu
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <strong>{item.name}</strong>
                        <span>₹{item.price} each</span>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, -1)}>
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-end">
                        <strong>₹{item.price * item.quantity}</strong>
                        <button
                          className="remove-button"
                          onClick={() =>
                            setCart((current) =>
                              current.filter((food) => food.id !== item.id),
                            )
                          }
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>₹{subtotal}</strong>
                  </div>
                  <div>
                    <span>Delivery fee</span>
                    <strong>₹{deliveryFee}</strong>
                  </div>
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>₹{total}</strong>
                  </div>
                  <button
                    className="primary-button checkout-button"
                    onClick={() => {
                      setCartOpen(false)
                      setCheckoutOpen(true)
                    }}
                  >
                    Proceed to checkout <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="overlay" onClick={() => setCheckoutOpen(false)}>
          <section
            className="checkout-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-heading">
              <div>
                <span className="section-kicker">ALMOST THERE</span>
                <h2>Checkout</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Close checkout"
              >
                <X />
              </button>
            </div>

            <form onSubmit={placeOrder}>
              <label htmlFor="customer-name">Full name</label>
              <input
                id="customer-name"
                value={customer.name}
                onChange={(event) =>
                  setCustomer({ ...customer, name: event.target.value })
                }
                placeholder="Enter your name"
                required
              />

              <label htmlFor="customer-phone">Phone number</label>
              <input
                id="customer-phone"
                type="tel"
                value={customer.phone}
                onChange={(event) =>
                  setCustomer({ ...customer, phone: event.target.value })
                }
                placeholder="Enter your phone number"
                required
                minLength={10}
              />

              <label htmlFor="customer-address">Delivery address</label>
              <textarea
                id="customer-address"
                value={customer.address}
                onChange={(event) =>
                  setCustomer({ ...customer, address: event.target.value })
                }
                placeholder="Enter your delivery address"
                required
                rows={3}
              />

              <div className="checkout-total">
                <span>Amount to pay</span>
                <strong>₹{total}</strong>
              </div>

              <p className="demo-note">
                Demo checkout only. No payment will be collected.
              </p>

              <button type="submit" className="primary-button checkout-button">
                Place demo order <ArrowRight size={18} />
              </button>
            </form>
          </section>
        </div>
      )}

      {orderSuccess && (
        <div className="overlay" onClick={() => setOrderSuccess(false)}>
          <section
            className="success-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="success-icon">
              <CheckCircle size={42} />
            </span>
            <h2>Order received!</h2>
            <p>
              Thank you, {customer.name || 'food lover'}! Your demo order has
              been created successfully.
            </p>
            <div className="order-reference">
              <span>DEMO ORDER NUMBER</span>
              <strong>{orderNumber}</strong>
            </div>
            <p className="demo-note">
              This order is currently stored only in the browser console. We
              will connect it to Laravel and MySQL next.
            </p>
            <button
              className="primary-button checkout-button"
              onClick={() => setOrderSuccess(false)}
            >
              Back to restaurant
            </button>
          </section>
        </div>
      )}
    </div>
    )}
    </>
  )
}

export default App
