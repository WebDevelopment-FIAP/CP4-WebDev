import { useEffect, useMemo, useState } from 'react'

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function useProducts() {
  const [state, setState] = useState({ products: [], loading: true, error: '' })

  const load = async () => {
    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      await wait(650)
      const response = await fetch(`${import.meta.env.BASE_URL}products.json?v=20260903-images`)
      if (!response.ok) throw new Error('Não foi possível carregar o catálogo.')
      const products = await response.json()
      setState({ products, loading: false, error: '' })
    } catch (error) {
      setState({ products: [], loading: false, error: error.message })
    }
  }

  useEffect(() => { load() }, [])
  return { ...state, reload: load }
}

function Header({ cartCount, onOpenCart }) {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="EcoTrend, início">
        <span className="brand-mark"><i className="fa-solid fa-leaf" /></span>
        <span>eco<span>trend</span></span>
      </a>
      <nav aria-label="Navegação principal">
        <a href="#catalogo">Produtos</a>
        <a href="#impacto">Nosso impacto</a>
        <a href="#equipe">Equipe</a>
      </nav>
      <button className="cart-button" onClick={onOpenCart} aria-label={`Abrir carrinho com ${cartCount} itens`}>
        <i className="fa-solid fa-bag-shopping" />
        <span>Carrinho</span>
        <strong>{cartCount}</strong>
      </button>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <p className="eyebrow"><i className="fa-solid fa-seedling" /> escolhas que regeneram</p>
        <h1>Leve para casa apenas o que faz bem.</h1>
        <p>Produtos úteis, bonitos e responsáveis — escolhidos para reduzir excessos sem abrir mão do seu estilo.</p>
        <div className="hero-actions">
          <a className="primary" href="#catalogo">Explorar produtos <i className="fa-solid fa-arrow-right" /></a>
          <span><strong>4,8/5</strong> avaliação da comunidade</span>
        </div>
      </div>
      <div className="hero-art" aria-label="Composição abstrata inspirada na natureza">
        <div className="sun" />
        <div className="arch"><i className="fa-solid fa-leaf" /></div>
        <div className="stamp">curadoria<br/><strong>consciente</strong></div>
        <span className="line line-one" /><span className="line line-two" />
      </div>
    </section>
  )
}

function Filters({ search, setSearch, category, setCategory, maxPrice, setMaxPrice, categories }) {
  return (
    <div className="filters" aria-label="Filtros do catálogo">
      <label className="search"><i className="fa-solid fa-magnifying-glass" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar no catálogo" /></label>
      <div className="category-list">
        {['Todos', ...categories].map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <label className="price-filter">Até <strong>{money.format(maxPrice)}</strong><input type="range" min="40" max="300" step="10" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></label>
    </div>
  )
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className={`product-visual ${product.tone}`}>
        <img src={`${import.meta.env.BASE_URL}${product.image}`} alt={`Foto de ${product.name}`} loading="lazy" />
        <span className="product-badge">{product.badge}</span>
      </div>
      <div className="product-info">
        <div className="product-meta"><span>{product.category}</span><span><i className="fa-solid fa-star" /> {product.rating}</span></div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-buy"><strong>{money.format(product.price)}</strong><button onClick={() => onAdd(product)}><i className="fa-solid fa-plus" /> Adicionar</button></div>
      </div>
    </article>
  )
}

function Cart({ open, items, products, onClose, changeQuantity, removeItem, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const catalogById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products])
  return (
    <>
      <button className={`overlay ${open ? 'visible' : ''}`} onClick={onClose} aria-label="Fechar carrinho" tabIndex={open ? 0 : -1} />
      <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="cart-heading"><div><p>Seu carrinho</p><h2>{items.length ? `${items.length} escolha${items.length > 1 ? 's' : ''}` : 'Ainda está vazio'}</h2></div><button onClick={onClose} aria-label="Fechar"><i className="fa-solid fa-xmark" /></button></div>
        <div className="cart-items">
          {!items.length && <div className="empty-cart"><i className="fa-solid fa-basket-shopping" /><p>Que tal encontrar algo que combine com a sua rotina?</p><button onClick={onClose}>Ver produtos</button></div>}
          {items.map((item) => {
            const image = item.image || catalogById.get(item.id)?.image
            return (
              <div className="cart-item" key={item.id}>
                <span className={`mini-visual ${item.tone}`}>
                  {image ? <img src={`${import.meta.env.BASE_URL}${image}`} alt={`Foto de ${item.name}`} /> : item.symbol}
                </span>
                <div><h3>{item.name}</h3><p>{money.format(item.price)}</p><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Diminuir quantidade">−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar quantidade">+</button></div></div>
                <button className="remove" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.name}`}><i className="fa-regular fa-trash-can" /></button>
              </div>
            )
          })}
        </div>
        {!!items.length && <div className="cart-summary"><div><span>Subtotal</span><strong>{money.format(total)}</strong></div><small>Frete calculado no checkout</small><button onClick={onCheckout}>Finalizar compra <i className="fa-solid fa-arrow-right" /></button></div>}
      </aside>
    </>
  )
}

function Checkout({ open, total, onClose, onSuccess }) {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', email: '', cep: '' })

  useEffect(() => { if (open) { setStatus('idle'); setMessage('') } }, [open])

  const submit = async (event) => {
    event.preventDefault()
    setStatus('loading'); setMessage('Validando seus dados…')
    try {
      await wait(750)
      if (form.name.trim().length < 3 || !form.email.includes('@') || form.cep.replace(/\D/g, '').length !== 8) throw new Error('Confira nome, e-mail e CEP antes de continuar.')
      setMessage('Confirmando o pedido…')
      await wait(950)
      setStatus('success'); setMessage(`Pedido #ECO${String(Date.now()).slice(-5)} confirmado!`)
      await wait(2200)
      onSuccess()
    } catch (error) {
      setStatus('error'); setMessage(error.message)
    }
  }

  if (!open) return null
  return (
    <div className="modal-wrap" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="checkout-modal">
        <button className="modal-close" onClick={onClose} aria-label="Fechar checkout"><i className="fa-solid fa-xmark" /></button>
        {status === 'success' ? <div className="checkout-success"><span><i className="fa-solid fa-check" /></span><p>Compra consciente concluída</p><h2>{message}</h2><small>Uma confirmação foi simulada para fins acadêmicos.</small></div> : <>
          <p className="eyebrow">checkout seguro</p><h2 id="checkout-title">Só mais alguns detalhes</h2><p className="checkout-lead">Total do pedido: <strong>{money.format(total)}</strong></p>
          <form onSubmit={submit}>
            <label>Nome completo<input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Como devemos chamar você?" /></label>
            <label>E-mail<input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="voce@email.com" /></label>
            <label>CEP<input required inputMode="numeric" maxLength="9" value={form.cep} onChange={(e) => setForm({...form, cep: e.target.value})} placeholder="00000-000" /></label>
            {message && <p className={`checkout-message ${status}`}>{status === 'loading' && <span className="tiny-spinner" />} {message}</p>}
            <button className="checkout-submit" disabled={status === 'loading'}>{status === 'loading' ? 'Processando…' : 'Confirmar pedido'}</button>
          </form>
        </>}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer id="equipe">
      <div className="footer-brand"><div className="brand"><span className="brand-mark"><i className="fa-solid fa-leaf" /></span><span>eco<span>trend</span></span></div><p>Projeto acadêmico desenvolvido para o Check-Point 04 — Web Development with JavaScript.</p></div>
      <div className="team"><p>Integrantes</p><ul><li><span>Eduardo Bechara Medeiros Craveiro</span><strong>RM 571081</strong></li><li><span>Gustavo Moita de Lima</span><strong>RM 569180</strong></li><li><span>Bruno Carreiro dos Santos</span><strong>RM 569423</strong></li></ul></div>
      <div className="footer-bottom"><span>FIAP • Engenharia de Software</span><span>© 2026 EcoTrend</span></div>
    </footer>
  )
}

export default function App() {
  const { products, loading, error, reload } = useProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [maxPrice, setMaxPrice] = useState(300)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecotrend-cart')) || [] } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('ecotrend-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 1800); return () => clearTimeout(id) }, [toast])

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products])
  const filtered = useMemo(() => products.filter((product) => {
    const matchesText = `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase())
    return matchesText && (category === 'Todos' || product.category === category) && product.price <= maxPrice
  }), [products, search, category, maxPrice])
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addToCart = (product) => {
    setCart((items) => items.some((item) => item.id === product.id) ? items.map((item) => item.id === product.id ? {...item, quantity: item.quantity + 1} : item) : [...items, {...product, quantity: 1}])
    setToast(`${product.name} foi para o carrinho`)
  }
  const changeQuantity = (id, amount) => setCart((items) => items.map((item) => item.id === id ? {...item, quantity: item.quantity + amount} : item).filter((item) => item.quantity > 0))
  const removeItem = (id) => setCart((items) => items.filter((item) => item.id !== id))
  const startCheckout = () => { setCartOpen(false); setCheckoutOpen(true) }
  const finishCheckout = () => { setCart([]); setCheckoutOpen(false); setToast('Pedido concluído com sucesso!') }

  return (
    <>
      <Header cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
      <main>
        <Hero />
        <section className="impact-strip" id="impacto"><div><strong>10</strong><span>marcas responsáveis</span></div><div><strong>100%</strong><span>curadoria transparente</span></div><div><strong>1 pedido</strong><span>menos excessos, mais propósito</span></div></section>
        <section className="catalog" id="catalogo">
          <div className="section-heading"><div><p className="eyebrow">curadoria ecotrend</p><h2>Pequenas escolhas, grande presença.</h2></div><p>Selecione por categoria, ajuste o valor e encontre o item certo para a sua rotina.</p></div>
          <Filters {...{ search, setSearch, category, setCategory, maxPrice, setMaxPrice, categories }} />
          {loading && <div className="loading-state"><span className="spinner" /><h3>Buscando escolhas melhores…</h3><p>Carregando o catálogo via Fetch.</p></div>}
          {error && <div className="error-state"><i className="fa-solid fa-cloud-arrow-down" /><h3>O catálogo tirou uma pausa.</h3><p>{error}</p><button onClick={reload}>Tentar novamente</button></div>}
          {!loading && !error && <><div className="results"><span>{filtered.length} produto{filtered.length !== 1 ? 's' : ''}</span><span>ordenados por curadoria</span></div><div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div>{!filtered.length && <div className="no-results"><i className="fa-regular fa-compass" /><h3>Nenhum produto por aqui.</h3><p>Tente mudar os filtros para ampliar a busca.</p></div>}</>}
        </section>
      </main>
      <Footer />
      <Cart open={cartOpen} items={cart} products={products} onClose={() => setCartOpen(false)} changeQuantity={changeQuantity} removeItem={removeItem} onCheckout={startCheckout} />
      <Checkout open={checkoutOpen} total={total} onClose={() => setCheckoutOpen(false)} onSuccess={finishCheckout} />
      <div className={`toast ${toast ? 'show' : ''}`}><i className="fa-solid fa-circle-check" /> {toast}</div>
    </>
  )
}
