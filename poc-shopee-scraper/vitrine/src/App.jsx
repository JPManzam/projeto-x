import React, { useState, useEffect } from 'react';
import productData from './products.json';

// Mock data content for legal pages to keep the file clean
const LEGAL_CONTENT = {
  privacy: `
    <h3>Política de Privacidade</h3>
    <p>Esta Política de Privacidade descreve como a TechSelect ("nós", "nosso") coleta, usa e compartilha informações pessoais quando você usa nosso site.</p>
    <h4>Coleta de Informações</h4>
    <p>Não coletamos informações pessoais identificáveis diretamente, exceto quando fornecidas voluntariamente por meio de formulários de contato. Coletamos dados anônimos de uso para melhorar a experiência do site.</p>
    <h4>Links de Terceiros</h4>
    <p>Nosso serviço contém links para o site da Amazon. Se você clicar em um link de terceiro, será direcionado para esse site. Recomendamos fortemente que reveja a Política de Privacidade de cada site que visita.</p>
  `,
  terms: `
    <h3>Termos de Uso</h3>
    <p>Ao acessar o site TechSelect, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis.</p>
    <h4>Uso de Licença</h4>
    <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site TechSelect, apenas para visualização transitória pessoal e não comercial.</p>
    <h4>Isenção de Responsabilidade</h4>
    <p>Os materiais no site da TechSelect são fornecidos 'como estão'. TechSelect não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização.</p>
  `
};

function App() {
  const [products, setProducts] = useState(productData);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeModal, setActiveModal] = useState(null);

  // Categories based on common output
  const categories = ['Todos', 'Tecnologia', 'Fitness', 'Casa', 'Lifestyle'];

  const openModal = (type) => (e) => {
    e.preventDefault();
    setActiveModal(type);
  }

  const closeModal = () => setActiveModal(null);

  // Simple keyword matching for filtering (client-side)
  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter(p => {
      const text = (p.title + ' ' + p.keyword).toLowerCase();
      if (activeCategory === 'Tecnologia') return text.includes('iphone') || text.includes('samsung') || text.includes('kindle') || text.includes('playstation') || text.includes('rtx');
      if (activeCategory === 'Fitness') return text.includes('creatina') || text.includes('whey') || text.includes('suplemento');
      if (activeCategory === 'Casa') return text.includes('casa') || text.includes('cozinha');
      return true;
    });

  const productCount = products.length;

  return (
    <div className="vitrine">
      {/* MODAL */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            <div dangerouslySetInnerHTML={{ __html: LEGAL_CONTENT[activeModal] }} />
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">TechSelect</div>
          <div className="nav-links">
            <a href="#ofertas">Ofertas</a>
            <a href="#categorias">Categorias</a>
            <a href="#sobre">Quem Somos</a>
            <a href="#faq">Perguntas Frequentes</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          Atualização Diária de Ofertas
        </div>
        <h1>
          Curadoria de ofertas<br />
          <span>para você economizar</span>
        </h1>
        <p className="hero-subtitle">
          Monitoramos os preços das maiores varejistas para trazer apenas as
          oportunidades que realmente valem a pena. Seleção feita por especialistas.
        </p>

        <div className="hero-cta">
          <a href="#ofertas" className="btn-primary">Explorar Ofertas</a>
          <a href="#sobre" className="btn-secondary">Nossa Missão</a>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">{productCount > 0 ? productCount : '10'}+</div>
            <div className="stat-label">Produtos Monitorados</div>
          </div>
          <div className="stat">
            <div className="stat-number">3x</div>
            <div className="stat-label">Verificações Diárias</div>
          </div>
          <div className="stat">
            <div className="stat-number">2026</div>
            <div className="stat-label">Fundada em</div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="trust-section">
        <div className="trust-badges">
          <div className="trust-item">
            <span className="trust-icon">🔍</span>
            <span className="trust-text">Curadoria Humana</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🛡️</span>
            <span className="trust-text">Links Seguros</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">⭐</span>
            <span className="trust-text">Melhores Avaliações</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section" id="categorias" style={{ padding: '0 24px 40px', textAlign: 'center' }}>
        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products-section" id="ofertas">
        <div className="section-header">
          <div className="section-eyebrow">Ofertas Disponíveis</div>
          <h2>Destaques de Hoje</h2>
          <p>Exibindo {filteredProducts.length} ofertas em {activeCategory}</p>
        </div>

        <div className="products-grid">
          {loading ? (
            <div className="loading-state">Carregando ofertas...</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <article key={index} className="product-card">
                <div className="product-image">
                  {index < 3 && activeCategory === 'Todos' && <span className="product-badge">🔥 Destaque</span>}
                  <img
                    src={product.image !== 'N/A' ? product.image : 'https://placehold.co/400x400/111/333?text=Produto'}
                    alt={product.title}
                    loading="lazy"
                  />
                </div>
                <div className="product-content">
                  <h3 className="product-title">{product.title}</h3>
                  <div className="product-price">
                    {product.price} <span>no Pix</span>
                  </div>
                  <a
                    href={product.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="buy-button"
                  >
                    Ver na Amazon
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>
              <p>Nenhuma oferta encontrada nesta categoria no momento.</p>
              <button onClick={() => setActiveCategory('Todos')} className="btn-secondary" style={{ marginTop: 10, cursor: 'pointer' }}>Ver todas as ofertas</button>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT US */}
      <section className="about-section" id="sobre" style={{ padding: '80px 24px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="section-header">
          <h2>Sobre a TechSelect</h2>
          <p style={{ maxWidth: 800, margin: '20px auto', lineHeight: 1.8 }}>
            Fundada com o objetivo de simplificar a busca pelos melhores produtos de tecnologia e estilo de vida,
            a TechSelect combina algoritmos de monitoramento de preços com uma curadoria humana especializada.
            Nossa missão é garantir que você nunca pague mais do que o necessário pelos produtos que ama.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section" id="faq" style={{ padding: '40px 24px', background: 'var(--bg-secondary)', textAlign: 'center', marginBottom: 80 }}>
        <div className="section-header">
          <h2>Perguntas Frequentes</h2>
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'left', lineHeight: 1.6 }}>
          <details style={{ marginBottom: 15, padding: 15, background: 'var(--bg-card)', borderRadius: 8 }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer' }}>Como garantimos os preços?</summary>
            <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>Os preços são verificados periodicamente. No entanto, podem sofrer alterações na loja parceira.</p>
          </details>
          <details style={{ marginBottom: 15, padding: 15, background: 'var(--bg-card)', borderRadius: 8 }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer' }}>A compra é segura?</summary>
            <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>Sim. Todos os links direcionam para a Amazon Brasil, onde todo o processo de pagamento e entrega é realizado.</p>
          </details>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">TechSelect</div>
            <p>
              Sua referência em ofertas verificadas.
            </p>
          </div>
          <div className="footer-column">
            <h4>Empresa</h4>
            <a href="#sobre">Quem Somos</a>
            <a href="#faq">FAQ</a>
            <a href="#" onClick={openModal('privacy')}>Privacidade</a>
          </div>
          <div className="footer-column">
            <h4>Categorias</h4>
            <button className="link-btn" onClick={() => setActiveCategory('Tecnologia')}>Tecnologia</button>
            <button className="link-btn" onClick={() => setActiveCategory('Fitness')}>Fitness</button>
            <button className="link-btn" onClick={() => setActiveCategory('Casa')}>Casa</button>
          </div>
          <div className="footer-column">
            <h4>Contato</h4>
            <a href="mailto:contato@techselect.com.br">contato@techselect.com.br</a>
            <a href="#">Atendimento</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="disclosure">
            <strong>Transparência:</strong> Este site participa do Programa de Associados da Amazon.
            Ao comprar através de nossos links, podemos receber uma comissão sem custo adicional para você.
            Isso financia nossa curadoria independente.
          </p>
          <div className="footer-legal">
            <p className="copyright">© 2026 TechSelect. Todos os direitos reservados.</p>
            <div className="legal-links">
              <button onClick={openModal('privacy')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}>Política de Privacidade</button>
              <button onClick={openModal('terms')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}>Termos de Uso</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
