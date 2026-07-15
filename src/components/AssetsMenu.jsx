import React, { useState } from 'react';
import { LUXURY_ASSETS } from '../logic/CuratedAssets';
import { STOCKS, CRYPTO, COMPANY_STOCKS, getActiveIPOs, getMarketNews, getSectorPerformance } from '../logic/Investments';
import './Modal.css';

export function AssetsMenu({
  person,
  onBuy,
  onSell,
  onRent,
  onEvict,
  onInvest,
  onDivest,
  onPartialDivest,
  onRenovate,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [activeTab, setActiveTab] = useState('owned'); // 'owned' | 'real_estate' | 'cars' | 'luxury' | 'investments'

  // Use persistent market from person object, or fallback to empty arrays
  const realEstateList = person.market?.realEstate || [];
  const carList = person.market?.cars || [];

  // Buy Modal State
  const [selectedAsset, setSelectedAsset] = useState(null); // Asset being considered for purchase

  const handleBuyClick = asset => {
    setSelectedAsset(asset);
  };

  const confirmBuy = method => {
    if (!selectedAsset) {
      return;
    }

    if (method === 'cash') {
      onBuy(selectedAsset, null);
    } else if (method === 'mortgage') {
      const downPayment = Math.floor(selectedAsset.price * 0.2);
      const loanAmount = selectedAsset.price - downPayment;
      const years = 30;
      const rate = 0.05; // 5% fixed
      // Monthly payment formula for a fixed-rate mortgage.
      const monthlyRate = rate / 12;
      const n = years * 12;
      const monthlyPayment = Math.ceil(
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
          (Math.pow(1 + monthlyRate, n) - 1)
      );

      onBuy(selectedAsset, {
        isMortgaged: true,
        downPayment,
        amount: loanAmount,
        monthlyPayment,
        interestRate: rate,
        term: years,
      });
    }
    setSelectedAsset(null);
  };

  // Renting State
  const [rentingAssetIndex, setRentingAssetIndex] = useState(null);
  const [monthlyRentInput, setMonthlyRentInput] = useState(2000);
  const [partialSell, setPartialSell] = useState(null); // { asset, position }
  const [partialSellPct, setPartialSellPct] = useState(50);

  // Investment State
  const [investModal, setInvestModal] = useState(null); // { type: 'buy'|'sell', asset: {...} }
  const [investAmount, setInvestAmount] = useState(1000);

  const handleRentClick = index => {
    const asset = person.assets[index];
    // Default rent Suggestion: 0.8% of value / 12 ~
    // Or simpler: Value * 0.005
    setMonthlyRentInput(Math.floor(asset.value * 0.005));
    setRentingAssetIndex(index);
  };

  const confirmRent = () => {
    const amount = Math.floor(Number(monthlyRentInput));
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }
    onRent(rentingAssetIndex, amount);
    setRentingAssetIndex(null);
  };

  const renderOwned = () => {
    if (person.assets.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
          <div className="empty-state-badge">🏠</div>
          <p>{t('assets.noAssets', "You don't own any assets yet.")}</p>
        </div>
      );
    }

    return person.assets.map((asset, index) => (
      <div
        key={asset.uniqueId || `${asset.name}-${index}`}
        className="list-item"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div>
          <div className="list-item-title">{asset.name}</div>
          <div className="list-item-subtitle" style={{ color: 'var(--text-secondary)' }}>
            {t('assets.valuedAt', 'Valued at $')}
            {asset.value.toLocaleString()}
            {asset.isMortgaged && (
              <span style={{ color: '#ff9800', marginLeft: '6px' }}>
                {t('assets.mortgaged', ' (Mortgaged)')}
              </span>
            )}
            {asset.isRented && (
              <span style={{ color: '#4caf50', marginLeft: '6px' }}>
                {t('assets.rented', ' (Rented)')}
              </span>
            )}
          </div>
          {asset.isMortgaged && asset.mortgage && (
            <div style={{ color: '#ffb74d', fontSize: '0.8rem', marginTop: '3px' }}>
              {t('assets.balance', 'Balance $')}
              {Math.round(asset.mortgage.balance).toLocaleString()}
              {' · '}${Math.round(asset.mortgage.monthlyPayment).toLocaleString()}
              {t('assets.perMonth', '/month')}
              {' · '}
              {((asset.mortgage.interestRate ?? 0.05) * 100).toFixed(1)}
              {t('assets.percentFixed', '% fixed')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {asset.type === 'Real Estate' && (
            <button
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.9em' }}
              onClick={() => onRenovate(index, asset)}
            >
              {t('assets.improve', '🛠️ Improve')}
            </button>
          )}
          {asset.type === 'Real Estate' && !asset.isRented && (
            <button
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.9em' }}
              onClick={() => handleRentClick(index)}
            >
              {t('assets.rentOut', '🔑 Rent Out')}
            </button>
          )}
          {asset.type === 'Real Estate' && asset.isRented && (
            <button
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.9em' }}
              onClick={() => onEvict(index)}
            >
              {t('assets.evict', '🚪 Evict')}
            </button>
          )}
          <button
            className="btn-danger"
            style={{ padding: '6px 12px', fontSize: '0.9em' }}
            onClick={() => onSell(index)}
          >
            {t('assets.sell', '💸 Sell')}
          </button>
        </div>
      </div>
    ));
  };

  const renderMarketList = list => {
    return list.map(asset => (
      <div key={asset.uniqueId} className="list-item">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="list-item-title">{asset.name}</span>
          <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>
            ${asset.price.toLocaleString()}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.9em',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <span>
            {t('assets.condition', 'Condition: ')}
            {asset.condition}%
          </span>
          <span>{asset.type}</span>
        </div>
        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: '10px' }}
          onClick={() => handleBuyClick(asset)}
        >
          {t('assets.buy', '🛒 Buy')}
        </button>
      </div>
    ));
  };

  const renderLuxury = () => {
    return LUXURY_ASSETS.map(asset => (
      <div key={asset.id} className="list-item">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="list-item-title">{asset.name}</span>
          <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>
            ${asset.price.toLocaleString()}
          </span>
        </div>
        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: '10px' }}
          onClick={() => handleBuyClick(asset)}
        >
          {t('assets.buy', '🛒 Buy')}
        </button>
      </div>
    ));
  };

  // Mortgage Confirmation Modal Overlay
  const renderBuyModal = () => {
    if (!selectedAsset) {
      return null;
    }

    const canAffordCash = person.money >= selectedAsset.price;
    const downPayment = Math.floor(selectedAsset.price * 0.2);
    const canAffordDown = person.money >= downPayment;
    const isRealEstate = selectedAsset.type === 'Real Estate';

    return (
      <div className="modal-overlay" style={{ zIndex: 200 }}>
        <div className="modal-content" style={{ maxWidth: '400px' }}>
          <h3>
            {t('assets.buyTitle', '🛒 Buy')} {selectedAsset.name}?
          </h3>
          <p>
            {t('assets.price', 'Price: ')}
            <strong>${selectedAsset.price.toLocaleString()}</strong>
          </p>
          {isRealEstate && (
            <p style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
              {t('assets.mortgageDownPayment', 'Mortgages require 20% down ($')}
              {downPayment.toLocaleString()}
              {').'}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            <button
              className="btn-primary"
              disabled={!canAffordCash}
              onClick={() => confirmBuy('cash')}
              style={{ opacity: canAffordCash ? 1 : 0.5 }}
            >
              {t('assets.payCash', '💵 Pay Cash')}
            </button>

            {isRealEstate && (
              <button
                className="btn-secondary"
                disabled={!canAffordDown}
                onClick={() => confirmBuy('mortgage')}
                style={{ opacity: canAffordDown ? 1 : 0.5 }}
              >
                {t('assets.applyMortgage', '🏦 Apply for Mortgage')}
              </button>
            )}

            <button
              className="btn-danger"
              onClick={() => setSelectedAsset(null)}
              style={{ marginTop: '10px' }}
            >
              {t('assets.cancel', '❌ Cancel')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRentModal = () => {
    if (rentingAssetIndex === null) {
      return null;
    }
    const asset = person.assets[rentingAssetIndex];
    const maximumRent = Math.max(1, Math.floor((Number(asset.value ?? asset.price) || 0) * 0.01));
    return (
      <div className="modal-overlay" style={{ zIndex: 210 }}>
        <div className="modal-content" style={{ maxWidth: '300px' }}>
          <h3>
            {t('assets.rentOutTitle', '🔑 Rent out')} {asset.name}
          </h3>
          <p>
            {t('assets.suggestedRent', 'Suggested Rent: $')}
            {Math.floor((Number(asset.value ?? asset.price) || 0) * 0.005).toLocaleString()}
            {t('assets.perMonth', '/mo')}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {t('assets.marketMax', 'Market maximum: $')}
            {maximumRent.toLocaleString()}
            {t('assets.perMonth', '/mo')}
          </p>
          <label>{t('assets.monthlyRent', 'Monthly Rent ($):')}</label>
          <input
            type="number"
            min="1"
            max={maximumRent}
            value={monthlyRentInput}
            onChange={e => setMonthlyRentInput(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button className="btn-primary" onClick={confirmRent}>
            {t('assets.confirm', '✅ Confirm')}
          </button>
          <button
            className="btn-secondary"
            onClick={() => setRentingAssetIndex(null)}
            style={{ marginTop: '10px' }}
          >
            {t('assets.cancel', '❌ Cancel')}
          </button>
        </div>
      </div>
    );
  };

  const renderInvestModal = () => {
    if (!investModal) {
      return null;
    }
    const isBuy = investModal.type === 'buy';
    const { asset } = investModal;

    return (
      <div className="modal-overlay" style={{ zIndex: 220 }}>
        <div className="modal-content" style={{ maxWidth: '300px' }}>
          <h3>
            {isBuy ? t('assets.buy', '🛒 Buy') : t('assets.sell', '💸 Sell')} {asset.name}
          </h3>
          {isBuy && (
            <>
              <p>{t('assets.howMuchInvest', 'How much to invest?')}</p>
              <input
                type="number"
                style={{ width: '100%', padding: '8px' }}
                value={investAmount}
                onChange={e => setInvestAmount(parseInt(e.target.value, 10) || 0)}
              />
              <div style={{ fontSize: '0.8em', marginTop: '5px' }}>
                {t('assets.cash', 'Cash: $')}
                {person.money.toLocaleString()}
              </div>
            </>
          )}
          {!isBuy && (
            <p>
              {t(
                'assets.sellEntirePosition',
                'Sell entire position? (Partial sell not implemented yet)'
              )}
            </p>
          )}

          <button
            className="btn-primary"
            style={{ marginTop: '15px' }}
            onClick={() => {
              if (isBuy) {
                onInvest(asset, investAmount);
              } else {
                onDivest(asset.id);
              }
              setInvestModal(null);
            }}
          >
            {t('assets.confirm', '✅ Confirm')}
          </button>
          <button
            className="btn-secondary"
            style={{ marginTop: '10px' }}
            onClick={() => setInvestModal(null)}
          >
            {t('assets.cancel', '❌ Cancel')}
          </button>
        </div>
      </div>
    );
  };

  const renderPartialSellModal = () => {
    if (!partialSell) return null;
    const { asset, position } = partialSell;
    const pct = partialSellPct;

    return (
      <div className="modal-overlay" style={{ zIndex: 230 }}>
        <div className="modal-content" style={{ maxWidth: '300px' }}>
          <h3>{t('assets.partialSell', 'Sell')} {asset.name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {t('assets.currentValue', 'Current:')} ${Math.floor(position.currentValue).toLocaleString()}
          </p>
          <p>{t('assets.sellPct', 'Percentage to sell:')}</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {[25, 50, 75, 100].map(v => (
              <button
                key={v}
                type="button"
                className={`language-chip ${pct === v ? 'active' : ''}`}
                onClick={() => setPartialSellPct(v)}
              >
                {v}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={pct}
            onChange={e => setPartialSellPct(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
          />
          <div style={{ textAlign: 'center', margin: '8px 0', fontWeight: 700 }}>
            ${Math.floor(position.currentValue * pct / 100).toLocaleString()}
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              if (pct >= 100) {
                onDivest(asset.id);
              } else {
                onPartialDivest(asset.id, pct / 100);
              }
              setPartialSellPct(50);
              setPartialSell(null);
            }}
          >
            {t('assets.confirm', '✅ Confirm')}
          </button>
          <button
            className="btn-secondary"
            onClick={() => { setPartialSellPct(50); setPartialSell(null); }}
            style={{ marginTop: '10px' }}
          >
            {t('assets.cancel', '❌ Cancel')}
          </button>
        </div>
      </div>
    );
  };

  const renderPortfolioSummary = () => {
    if (!person.portfolio || person.portfolio.length === 0) return null;

    const totalInvested = person.portfolio.reduce((s, p) => s + (p.invested || 0), 0);
    const totalValue = person.portfolio.reduce((s, p) => s + (p.currentValue || 0), 0);
    const totalDividends = person.portfolio.reduce((s, p) => s + (p.totalDividends || 0), 0);
    const totalGain = totalValue - totalInvested;
    const gainPct = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(1) : '0.0';

    return (
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('assets.invested', 'Invested')}</div>
          <div style={{ fontWeight: 700 }}>${totalInvested.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('assets.currentValue', 'Current')}</div>
          <div style={{ fontWeight: 700 }}>${totalValue.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('assets.gainLoss', 'Gain/Loss')}</div>
          <div style={{ fontWeight: 700, color: totalGain >= 0 ? '#4caf50' : '#ef5350' }}>
            {totalGain >= 0 ? '+' : '-'}${Math.abs(totalGain).toLocaleString()} ({gainPct}%)
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('assets.dividends', 'Dividends')}</div>
          <div style={{ fontWeight: 700, color: '#4caf50' }}>${totalDividends.toLocaleString()}</div>
        </div>
      </div>
    );
  };

  const renderPositionCard = (asset, position) => {
    const profit = position.currentValue - position.invested;
    const profitColor = profit >= 0 ? '#4caf50' : '#ef5350';
    const dividends = position.totalDividends || 0;

    return (
      <div key={asset.id} className="list-item">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div className="list-item-title">{asset.name}</div>
            <div className="list-item-subtitle">
              {asset.type.toUpperCase()} &bull; {t('assets.risk', 'Risk:')} {asset.risk}
              {asset.sector && asset.sector !== 'index' && asset.sector !== 'crypto' && (
                <> &bull; {asset.sector.charAt(0).toUpperCase() + asset.sector.slice(1)}</>
              )}
              {asset.dividendYield > 0 && (
                <> &bull; {t('assets.divYield', 'Div:')} {(asset.dividendYield * 100).toFixed(1)}%</>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              ${Math.floor(position.currentValue).toLocaleString()}
            </div>
            <div style={{ color: profitColor, fontSize: '0.85rem' }}>
              {profit >= 0 ? '+' : '-'}${Math.abs(Math.floor(profit)).toLocaleString()}
            </div>
            {dividends > 0 && (
              <div style={{ color: '#4caf50', fontSize: '0.78rem' }}>
                💰 ${dividends.toLocaleString()} {t('assets.divReceived', 'div')}
              </div>
            )}
          </div>
        </div>

        {position.history?.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'end', gap: '3px', height: '34px', marginTop: '12px' }}>
            {position.history.map((point, index) => {
              const max = Math.max(...position.history.map(item => item.value), 1);
              const h = Math.max(4, Math.round((point.value / max) * 32));
              return (
                <div
                  key={`${asset.id}-${point.age}-${index}`}
                  title={`${t('assets.age', 'Age')} ${point.age}: $${Math.floor(point.value).toLocaleString()}`}
                  style={{
                    flex: 1,
                    height: `${h}px`,
                    background: point.value >= position.invested ? '#4caf50' : '#ef5350',
                    borderRadius: '3px',
                  }}
                />
              );
            })}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
          <button className="btn-primary" onClick={() => setInvestModal({ type: 'buy', asset })}>
            {t('assets.invest', '📈 Invest')}
          </button>
          <button className="btn-secondary" onClick={() => setPartialSell({ asset, position })}>
            {t('assets.sell', '💸 Sell')}
          </button>
        </div>
      </div>
    );
  };

  const renderInvestments = () => {
    const allAssets = [...STOCKS, ...COMPANY_STOCKS, ...CRYPTO];
    const activeIPOs = getActiveIPOs();

    return (
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '1.1em' }}>
          {t('assets.stockMarket', '📈 Stock Market & Crypto')}
        </h3>

        {renderPortfolioSummary()}

        {allAssets.map(asset => {
          const position = person.portfolio?.find(pos => pos.id === asset.id);
          if (position) {
            return renderPositionCard(asset, position);
          }
          return null;
        })}

        <h4 style={{ margin: '16px 0 8px', fontSize: '0.95em', color: 'var(--text-secondary)' }}>
          {t('assets.availableInvest', 'Available to Invest')}
        </h4>

        {allAssets.map(asset => {
          const position = person.portfolio?.find(pos => pos.id === asset.id);
          if (position) return null;
          return (
            <div key={asset.id} className="list-item" style={{ opacity: 0.85 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div className="list-item-title">{asset.name}</div>
                  <div className="list-item-subtitle">
                    {asset.type.toUpperCase()} &bull; {t('assets.risk', 'Risk:')} {asset.risk}
                    {asset.sector && asset.sector !== 'index' && asset.sector !== 'crypto' && (
                      <> &bull; {asset.sector.charAt(0).toUpperCase() + asset.sector.slice(1)}</>
                    )}
                    {asset.dividendYield > 0 && (
                      <> &bull; {t('assets.divYield', 'Div:')} {(asset.dividendYield * 100).toFixed(1)}%</>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {t('assets.noPosition', 'No position')}
                  </div>
                </div>
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: '10px' }}
                onClick={() => setInvestModal({ type: 'buy', asset })}
              >
                {t('assets.invest', '📈 Invest')}
              </button>
            </div>
          );
        })}

        {activeIPOs.length > 0 && (
          <>
            <h4 style={{ margin: '20px 0 8px', fontSize: '0.95em', color: 'var(--accent-primary)' }}>
              🚀 {t('assets.ipos', 'New IPOs')}
            </h4>
            {activeIPOs.map(ipo => (
              <div key={ipo.id} className="list-item" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div className="list-item-title">{ipo.name}</div>
                    <div className="list-item-subtitle">
                      IPO &bull; ${Math.floor(ipo.ipoPrice).toLocaleString()} &bull; {t('assets.risk', 'Risk:')} {ipo.risk}
                      {ipo.dividendYield > 0 && (
                        <> &bull; {t('assets.divYield', 'Div:')} {(ipo.dividendYield * 100).toFixed(1)}%</>
                      )}
                    </div>
                  </div>
                  <div>
                    {person.portfolio?.find(p => p.id === ipo.id) ? (
                      <span style={{ color: '#4caf50', fontWeight: 700 }}>
                        ${Math.floor(person.portfolio.find(p => p.id === ipo.id).currentValue).toLocaleString()}
                      </span>
                    ) : (
                      <button
                        className="btn-primary"
                        onClick={() => setInvestModal({ type: 'buy', asset: ipo })}
                      >
                        {t('assets.invest', '📈 Invest')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="market-note" style={{ marginTop: '16px' }}>
          {t(
            'assets.marketNote',
            'Market prices update every year. Stocks are steadier, crypto is volatile.'
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      {renderBuyModal()}
      {renderRentModal()}
      {renderInvestModal()}
      {renderPartialSellModal()}
      <div
        className="modal-content"
        style={{ maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{t('assets.title', '🏠 Assets & Shopping')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            marginBottom: '20px',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {[
            { id: 'owned', label: 'My Assets', tag: '🏠' },
            { id: 'real_estate', label: 'Real Estate', tag: '🏡' },
            { id: 'cars', label: 'Car Dealer', tag: '🚗' },
            { id: 'luxury', label: 'Luxury', tag: '💎' },
            { id: 'investments', label: 'Investments', tag: '📈' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                borderRadius: '12px 12px 0 0',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontSize: '0.95rem',
              }}
            >
              <span className="tab-tag">{tab.tag}</span> {t(`assets.tab.${tab.id}`, tab.label)}
            </button>
          ))}
        </div>

        <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'owned' && renderOwned()}
          {activeTab === 'real_estate' && renderMarketList(realEstateList)}
          {activeTab === 'cars' && renderMarketList(carList)}
          {activeTab === 'luxury' && renderLuxury()}
          {activeTab === 'investments' && renderInvestments()}
        </div>
      </div>
    </div>
  );
}
