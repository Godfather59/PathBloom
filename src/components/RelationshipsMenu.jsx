import React, { useState, useEffect } from 'react';
import { NPCSimulator } from '../logic/NPCSimulator';

const normalizeType = type => {
  if (typeof type !== 'string') {
    return '';
  }
  return type.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const isFiance = type => normalizeType(type) === 'Fiance';
const displayType = type => (isFiance(type) ? 'Fiance' : type);

const TRAIT_LABELS = {
  loyal: ['Loyal', 'وفيّ'],
  affectionate: ['Affectionate', 'حنون'],
  ambitious: ['Ambitious', 'طموح'],
  independent: ['Independent', 'مستقل'],
  sensitive: ['Sensitive', 'حساس'],
  playful: ['Playful', 'مرح'],
  practical: ['Practical', 'عملي'],
  adventurous: ['Adventurous', 'مغامر'],
};

const NEED_LABELS = {
  honesty: ['Honesty', 'الصدق'],
  affection: ['Affection', 'المودة'],
  encouragement: ['Encouragement', 'التشجيع'],
  autonomy: ['Personal space', 'المساحة الشخصية'],
  reassurance: ['Reassurance', 'الطمأنينة'],
  fun: ['Fun', 'المرح'],
  stability: ['Stability', 'الاستقرار'],
  shared_experiences: ['Shared experiences', 'التجارب المشتركة'],
};

const ACTION_LABELS = {
  spend_time: ['quality time', 'قضاء وقت ممتع'],
  compliment: ['compliments', 'المجاملات'],
  make_promise: ['clear commitments', 'الالتزامات الواضحة'],
  apologize: ['a sincere apology', 'اعتذار صادق'],
  give_space: ['personal space', 'مساحة شخصية'],
  talk_it_out: ['an honest conversation', 'حوار صريح'],
  cheat: ['betrayal', 'الخيانة'],
  insult: ['hurtful words', 'الكلام الجارح'],
  give_gift: ['thoughtful gifts', 'الهدايا المدروسة'],
};

const TYPE_LABELS = {
  Father: ['Father', 'الأب'],
  Mother: ['Mother', 'الأم'],
  Parent: ['Parent', 'الوالد'],
  King: ['King', 'الملك'],
  Queen: ['Queen', 'الملكة'],
  Child: ['Child', 'الابن/الابنة'],
  Sibling: ['Sibling', 'الأخ/الأخت'],
  Friend: ['Friend', 'صديق'],
  'Best Friend': ['Best Friend', 'أفضل صديق'],
  Partner: ['Partner', 'الشريك'],
  Fiance: ['Fiancé', 'الخطيب/الخطيبة'],
  Spouse: ['Spouse', 'الزوج/الزوجة'],
};

const MEMORY_LABELS = {
  family_bond: ['A strong family bond', 'رابطة عائلية قوية'],
  relationship_started: ['The beginning of your relationship', 'بداية علاقتكما'],
  quality_time: ['You spent quality time together', 'قضيتما وقتاً ممتعاً معاً'],
  shared_moment: ['You remembered a favorite moment', 'تذكرتما لحظة مفضلة'],
  compliment: ['A compliment made them smile', 'مجاملة أسعدتهم'],
  compliment_rejected: ['A compliment felt insincere', 'بدت المجاملة غير صادقة'],
  insult: ['Hurtful words were exchanged', 'قيل كلام جارح'],
  promise_made: ['You made a promise', 'قطعت وعداً'],
  promise_kept: ['You kept your promise', 'وفيت بوعدك'],
  promise_broken: ['You broke your promise', 'أخلفت وعدك'],
  conflict_started: ['An unresolved conflict began', 'بدأ خلاف لم يُحل'],
  conflict_deepened: ['Tension turned into resentment', 'تحول التوتر إلى استياء'],
  conflict_resolved: ['You repaired the relationship', 'أصلحتما العلاقة'],
  intimacy: ['You shared an intimate moment', 'شاركتما لحظة حميمة'],
  intimacy_rejected: ['They were not ready for intimacy', 'لم يكونوا مستعدين للحميمية'],
  proposal_accepted: ['Your proposal was accepted', 'تم قبول عرض الزواج'],
  proposal_rejected: ['Your proposal was rejected', 'تم رفض عرض الزواج'],
  prenup_conflict: ['A prenup caused tension', 'سبب عقد ما قبل الزواج توتراً'],
  gift_given: ['You gave a thoughtful gift', 'أهديت هدية مدروسة'],
  wedding: ['Your wedding day', 'يوم زفافكما'],
  betrayal: ['Trust was broken by betrayal', 'تحطمت الثقة بسبب الخيانة'],
  joint_finances: ['You agreed on a joint household budget', 'اتفقتما على ميزانية منزلية مشتركة'],
  separate_finances: ['You agreed to keep separate accounts', 'اتفقتما على إبقاء الحسابات منفصلة'],
  parenting_support: ['You supported their dream', 'دعمت حلمهم'],
  parenting_boundaries: ['You set an important boundary', 'وضعت حدوداً مهمة'],
};

export function RelationshipsMenu({
  person,
  onInteract,
  onClose,
  showToast,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const localize = (key, labels) => {
    const [english, arabic] = labels || [key, key];
    const fallback = language === 'ar' ? arabic : english;
    const translated = t(key, fallback);
    return language === 'ar' && (translated === key || translated === english)
      ? arabic
      : translated;
  };
  const labelFor = (group, id, labels) =>
    localize(`relationships.${group}.${id}`, labels?.[id] || [id, id]);
  const relationshipTypeLabel = type => {
    const normalized = displayType(type);
    return localize(
      `relationships.types.${normalized.replace(/\s+/g, '_').toLowerCase()}`,
      TYPE_LABELS[normalized] || [normalized, normalized]
    );
  };

  // Store ID instead of object to ensuring we always render fresh data from props
  const [selectedRelId, setSelectedRelId] = useState(null);

  // Derive selected relationship from current person prop
  const selectedRel = selectedRelId ? person.relationships.find(r => r.id === selectedRelId) : null;

  // If selected relationship is gone (e.g. died/removed), reset selection
  useEffect(() => {
    if (selectedRelId && !selectedRel) {
      setSelectedRelId(null);
    }
  }, [selectedRelId, selectedRel, person]);

  const itemDisabled = minAge => person.age < minAge;
  const intimacyDisabled =
    person.age < 18 || person.lastIntimacyAge === person.age || (person.energy ?? 100) < 15;

  // Action Modal State
  const [actionModal, setActionModal] = useState(null); // { type: 'propose'|'wedding'|'cheat', relId: string }
  const [ringCost, setRingCost] = useState(2000);
  const [weddingBudget, setWeddingBudget] = useState(5000);
  const [prenup, setPrenup] = useState(false);

  const handleActionClick = (type, relId) => {
    setActionModal({ type, relId });
    setRingCost(2000); // Reset defaults
    setWeddingBudget(5000);
    setPrenup(false);
  };

  const confirmAction = () => {
    if (!actionModal) {
      return;
    }
    const { type, relId } = actionModal;

    let payload = {};
    if (type === 'propose') {
      payload = { ringCost };
    } else if (type === 'wedding') {
      payload = { budget: weddingBudget, prenup };
    }

    onInteract(relId, type === 'wedding' ? 'marry' : type, payload);
    setActionModal(null);
  };

  const StatBar = ({ value, color }) => (
    <div
      style={{
        height: '6px',
        backgroundColor: '#333',
        borderRadius: '3px',
        marginTop: '4px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );

  const renderActionModal = () => {
    if (!actionModal) {
      return null;
    }
    const { type } = actionModal;

    return (
      <div className="modal-overlay" style={{ zIndex: 200 }}>
        <div className="modal-content" style={{ maxWidth: '300px' }}>
          <h3>
            {type === 'propose'
              ? t('relationships.marryMe', 'Will you marry me?')
              : type === 'wedding'
                ? t('relationships.planWedding', 'Plan Wedding')
                : t('relationships.cheat', 'Cheat')}
          </h3>

          {type === 'propose' && (
            <>
              <p>{t('relationships.ringCost', 'Select Ring Cost')}:</p>
              <select
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                value={ringCost}
                onChange={e => setRingCost(parseInt(e.target.value, 10))}
              >
                <option value={100}>{t('relationships.plasticRing', 'Plastic Ring ($100)')}</option>
                <option value={1000}>
                  {localize('relationships.silverRing', [
                    'Silver Ring ($1,000)',
                    'خاتم فضة (1,000$)',
                  ])}
                </option>
                <option value={2000}>
                  {localize('relationships.goldRing', ['Gold Ring ($2,000)', 'خاتم ذهب (2,000$)'])}
                </option>
                <option value={5000}>
                  {localize('relationships.diamondRing', [
                    'Diamond Ring ($5,000)',
                    'خاتم ألماس (5,000$)',
                  ])}
                </option>
                <option value={10000}>
                  {localize('relationships.hugeRock', [
                    'Huge Rock ($10,000)',
                    'ألماسة ضخمة (10,000$)',
                  ])}
                </option>
                <option value={50000}>
                  {t('relationships.vintageRing', 'Vintage Tiffany ($50,000)')}
                </option>
              </select>
            </>
          )}

          {type === 'wedding' && (
            <>
              <p>{t('relationships.weddingBudget', 'Wedding Budget')}:</p>
              <select
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                value={weddingBudget}
                onChange={e => setWeddingBudget(parseInt(e.target.value, 10))}
              >
                <option value={100}>{t('relationships.courthouse', 'Courthouse ($100)')}</option>
                <option value={1000}>
                  {localize('relationships.backyard', [
                    'Backyard ($1,000)',
                    'حديقة منزلية (1,000$)',
                  ])}
                </option>
                <option value={5000}>
                  {localize('relationships.golfCourse', [
                    'Golf Course ($5,000)',
                    'نادي غولف (5,000$)',
                  ])}
                </option>
                <option value={20000}>
                  {localize('relationships.fancyHotel', [
                    'Fancy Hotel ($20,000)',
                    'فندق فاخر (20,000$)',
                  ])}
                </option>
                <option value={100000}>{t('relationships.castle', 'Castle ($100,000)')}</option>
              </select>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={prenup}
                    onChange={e => setPrenup(e.target.checked)}
                  />
                  {t('relationships.prenup', 'Sign Prenup?')}
                </label>
                <div style={{ fontSize: '0.8em', color: '#aaa' }}>
                  {t('relationships.prenupDesc', 'Protects assets, but may offend spouse.')}
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn-primary" onClick={confirmAction}>
              {t('relationships.confirm', 'Confirm')}
            </button>
            <button className="btn-secondary" onClick={() => setActionModal(null)}>
              {t('relationships.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relationships-menu animate-fade-in"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 100,
        color: '#fff',
      }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {renderActionModal()}
      <div
        className="animate-slide-up"
        style={{
          backgroundColor: '#1f1f1f',
          borderRadius: '12px',
          width: '100%',
          maxHeight: '80%',
          overflowY: 'auto',
          padding: '20px',
          border: '1px solid #333',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '10px' }}
        >
          <h2 style={{ margin: 0, color: '#fff' }}>{t('relationships.title', 'Relationships')}</h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px 12px',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            X
          </button>
        </div>

        {selectedRel ? (
          <div className="rel-detail">
            <button
              onClick={() => setSelectedRelId(null)}
              style={{
                marginBottom: '16px',
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #555',
                color: '#ccc',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              &larr; {t('relationships.back', 'Back')}
            </button>

            <h3 className="text-center" style={{ color: '#fff' }}>
              {selectedRel.name}{' '}
              <span style={{ color: '#888', fontSize: '0.8em' }}>
                ({relationshipTypeLabel(selectedRel.type)})
              </span>
            </h3>
            <div
              style={{
                margin: '16px 0',
                textAlign: 'center',
                background: '#252525',
                padding: '15px',
                borderRadius: '8px',
              }}
            >
              <div style={{ marginBottom: '5px' }}>
                {t('relationships.relationship', 'Relationship')}:{' '}
                <span style={{ fontWeight: 'bold' }}>{selectedRel.stat}%</span>
              </div>
              <StatBar
                value={selectedRel.stat}
                color={selectedRel.stat > 50 ? '#4caf50' : '#ef5350'}
              />
            </div>

            {selectedRel.npcData && (
              <section
                style={{
                  marginBottom: '12px',
                  background: '#1e2a2e',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #2a4047',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '9px', color: '#80cbc4' }}>
                  {localize('relationships.lifeStatus', ['Life Status', 'حالة الحياة'])}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: '0.88em',
                  }}
                >
                  {selectedRel.npcData.isAlive === false && (
                    <div style={{ color: '#ef5350', fontWeight: 'bold', gridColumn: '1 / -1' }}>
                      {localize('relationships.deceased', ['Deceased', 'متوفى'])}
                    </div>
                  )}
                  {selectedRel.npcData.job && (
                    <div>
                      <span style={{ color: '#888' }}>
                        {localize('relationships.job', ['Job', 'الوظيفة'])}:
                      </span>{' '}
                      {selectedRel.npcData.job.title}
                    </div>
                  )}
                  {selectedRel.npcData.education && selectedRel.npcData.education !== 'None' && (
                    <div>
                      <span style={{ color: '#888' }}>
                        {localize('relationships.education', ['Education', 'التعليم'])}:
                      </span>{' '}
                      {selectedRel.npcData.education}
                    </div>
                  )}
                  <div>
                    <span style={{ color: '#888' }}>
                      {localize('relationships.happiness', ['Happiness', 'السعادة'])}:
                    </span>{' '}
                    {Math.round(selectedRel.npcData.happiness)}/100
                  </div>
                  <div>
                    <span style={{ color: '#888' }}>
                      {localize('relationships.health', ['Health', 'الصحة'])}:
                    </span>{' '}
                    {Math.round(selectedRel.npcData.health)}/100
                  </div>
                  {selectedRel.npcData.money != null && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: '#888' }}>
                        {localize('relationships.wealth', ['Wealth', 'الثروة'])}:
                      </span>{' '}
                      ${selectedRel.npcData.money.toLocaleString()}
                    </div>
                  )}
                </div>
              </section>
            )}

            {(selectedRel.personalityTraits || []).length > 0 && (
              <section
                style={{
                  marginBottom: '12px',
                  background: '#252525',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid #383838',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '9px' }}>
                  {localize('relationships.personality', ['Personality', 'الشخصية'])}
                </div>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}
                >
                  {selectedRel.personalityTraits.map(trait => (
                    <span
                      key={trait}
                      style={{
                        background: '#3949ab',
                        borderRadius: '999px',
                        padding: '4px 9px',
                        fontSize: '0.82em',
                      }}
                    >
                      {labelFor('traits', trait, TRAIT_LABELS)}
                    </span>
                  ))}
                </div>
                <div style={{ color: '#ccc', fontSize: '0.88em', lineHeight: 1.5 }}>
                  <strong>{localize('relationships.needs', ['Needs', 'الاحتياجات'])}:</strong>{' '}
                  {(selectedRel.needs || [])
                    .map(need => labelFor('needs', need, NEED_LABELS))
                    .join(' · ')}
                </div>
                {(selectedRel.preferences?.likes || []).length > 0 && (
                  <div
                    style={{
                      color: '#9ecbff',
                      fontSize: '0.86em',
                      marginTop: '5px',
                      lineHeight: 1.5,
                    }}
                  >
                    {localize('relationships.respondsBest', [
                      'Responds best to',
                      'يستجيب بشكل أفضل لـ',
                    ])}
                    :{' '}
                    {selectedRel.preferences.likes
                      .map(action => labelFor('actions', action, ACTION_LABELS))
                      .join(' · ')}
                  </div>
                )}
              </section>
            )}

            {selectedRel.promise?.status === 'active' && (
              <section
                style={{
                  marginBottom: '12px',
                  background: '#173525',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #2e7d32',
                  fontSize: '0.9em',
                }}
              >
                <strong>
                  {localize('relationships.activePromise', ['Active promise', 'وعد نشط'])}:
                </strong>{' '}
                {localize('relationships.promiseQualityTime', [
                  `Spend meaningful time with ${selectedRel.name} by age ${selectedRel.promise.dueAge}.`,
                  `اقضِ وقتاً مهماً مع ${selectedRel.name} قبل سن ${selectedRel.promise.dueAge}.`,
                ])}
              </section>
            )}

            {person.age >= 18 &&
              ['Partner', 'Fiance', 'Spouse'].includes(displayType(selectedRel.type)) && (
                <section
                  style={{
                    marginBottom: '12px',
                    background: '#222d35',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #3d596b',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {localize('relationships.sharedFinances', ['Shared finances', 'المال المشترك'])}
                  </div>
                  <div style={{ color: '#bbb', fontSize: '0.86em', marginBottom: '9px' }}>
                    {selectedRel.financialArrangement?.style === 'joint'
                      ? localize('relationships.jointBudgetActive', [
                          'Current plan: joint household budget',
                          'الخطة الحالية: ميزانية منزلية مشتركة',
                        ])
                      : selectedRel.financialArrangement?.style === 'separate'
                        ? localize('relationships.separateAccountsActive', [
                            'Current plan: separate personal accounts',
                            'الخطة الحالية: حسابات شخصية منفصلة',
                          ])
                        : localize('relationships.noFinancePlan', [
                            'You have not agreed on how to manage money yet.',
                            'لم تتفقا بعد على كيفية إدارة المال.',
                          ])}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button
                      onClick={() =>
                        onInteract(selectedRel.id, 'set_financial_style', { style: 'joint' })
                      }
                      style={{
                        padding: '9px 6px',
                        background: '#2e7d32',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {localize('relationships.jointBudget', ['Joint Budget', 'ميزانية مشتركة'])}
                    </button>
                    <button
                      onClick={() =>
                        onInteract(selectedRel.id, 'set_financial_style', { style: 'separate' })
                      }
                      style={{
                        padding: '9px 6px',
                        background: '#455a64',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {localize('relationships.separateAccounts', [
                        'Separate Accounts',
                        'حسابات منفصلة',
                      ])}
                    </button>
                  </div>
                </section>
              )}

            {selectedRel.type === 'Child' && (
              <section
                style={{
                  marginBottom: '12px',
                  background: '#2f2838',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #58476d',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {localize('relationships.parentingDecision', [
                    'Parenting decision',
                    'قرار تربوي',
                  ])}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button
                    disabled={selectedRel.lastParentingDecisionAge === person.age}
                    onClick={() => onInteract(selectedRel.id, 'support_child')}
                    style={{
                      padding: '9px 6px',
                      background:
                        selectedRel.lastParentingDecisionAge === person.age ? '#333' : '#6a1b9a',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor:
                        selectedRel.lastParentingDecisionAge === person.age
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    {localize('relationships.supportDream', ['Support Their Dream', 'ادعم حلمهم'])}
                  </button>
                  <button
                    disabled={selectedRel.lastParentingDecisionAge === person.age}
                    onClick={() => onInteract(selectedRel.id, 'set_boundaries')}
                    style={{
                      padding: '9px 6px',
                      background:
                        selectedRel.lastParentingDecisionAge === person.age ? '#333' : '#ad6b16',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor:
                        selectedRel.lastParentingDecisionAge === person.age
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    {localize('relationships.setBoundaries', ['Set Boundaries', 'ضع حدوداً'])}
                  </button>
                </div>
              </section>
            )}

            {selectedRel.activeConflict && (
              <section
                style={{
                  marginBottom: '12px',
                  background: '#3a2020',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #8e3b3b',
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#ffb4ab', marginBottom: '5px' }}>
                  {localize('relationships.unresolvedConflict', [
                    'Unresolved conflict',
                    'خلاف لم يُحل',
                  ])}
                </div>
                <div style={{ color: '#ddd', fontSize: '0.88em', marginBottom: '10px' }}>
                  {selectedRel.activeConflict.stage === 'resentment'
                    ? localize('relationships.conflictResentment', [
                        'The tension has turned into resentment. Repairing it will take more effort.',
                        'تحول التوتر إلى استياء، وإصلاح العلاقة سيتطلب جهداً أكبر.',
                      ])
                    : localize('relationships.conflictTension', [
                        'There is tension between you. How you respond should fit their personality.',
                        'يوجد توتر بينكما. اختر رداً يناسب شخصيتهم.',
                      ])}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '6px',
                  }}
                >
                  <button
                    onClick={() => onInteract(selectedRel.id, 'apologize')}
                    style={{
                      padding: '9px 5px',
                      background: '#8e3b3b',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {localize('relationships.apologize', ['Apologize', 'اعتذر'])}
                  </button>
                  <button
                    onClick={() => onInteract(selectedRel.id, 'give_space')}
                    style={{
                      padding: '9px 5px',
                      background: '#455a64',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {localize('relationships.giveSpace', ['Give Space', 'امنح مساحة'])}
                  </button>
                  <button
                    onClick={() => onInteract(selectedRel.id, 'talk_it_out')}
                    style={{
                      padding: '9px 5px',
                      background: '#1565c0',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {localize('relationships.talkItOut', ['Talk It Out', 'تحدث بصراحة'])}
                  </button>
                </div>
              </section>
            )}

            {(selectedRel.memories || []).length > 0 && (
              <details
                style={{
                  marginBottom: '12px',
                  background: '#252525',
                  padding: '11px 13px',
                  borderRadius: '8px',
                  border: '1px solid #383838',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  {localize('relationships.sharedMemories', ['Shared memories', 'ذكريات مشتركة'])} (
                  {selectedRel.memories.length}/8)
                </summary>
                <div style={{ display: 'grid', gap: '7px', marginTop: '10px' }}>
                  {[...selectedRel.memories]
                    .reverse()
                    .slice(0, 4)
                    .map(memory => (
                      <div
                        key={memory.id}
                        style={{
                          color: '#ccc',
                          fontSize: '0.84em',
                          borderInlineStart: `3px solid ${memory.impact >= 0 ? '#4caf50' : '#ef5350'}`,
                          paddingInlineStart: '8px',
                        }}
                      >
                        <span style={{ color: '#888' }}>
                          {localize('relationships.ageLabel', ['Age', 'العمر'])} {memory.age}
                        </span>
                        {' · '}
                        {labelFor('memories', memory.type, MEMORY_LABELS)}
                      </div>
                    ))}
                </div>
              </details>
            )}

            <div style={{ display: 'grid', gap: '10px' }}>
              <button
                onClick={() => onInteract(selectedRel.id, 'spend_time')}
                style={{
                  padding: '12px',
                  backgroundColor: '#1565c0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {t('relationships.spendTime', 'Spend Time')}
              </button>
              {(selectedRel.personalityTraits || []).length > 0 && (
                <button
                  onClick={() => onInteract(selectedRel.id, 'make_promise')}
                  disabled={selectedRel.promise?.status === 'active'}
                  style={{
                    padding: '12px',
                    backgroundColor: selectedRel.promise?.status === 'active' ? '#333' : '#6a1b9a',
                    color: selectedRel.promise?.status === 'active' ? '#777' : 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: selectedRel.promise?.status === 'active' ? 'not-allowed' : 'pointer',
                  }}
                >
                  {selectedRel.promise?.status === 'active'
                    ? localize('relationships.promisePending', [
                        'Promise Pending',
                        'الوعد قيد الانتظار',
                      ])
                    : localize('relationships.makePromise', [
                        'Promise Quality Time',
                        'عِد بوقت مشترك',
                      ])}
                </button>
              )}
              <button
                onClick={() => onInteract(selectedRel.id, 'compliment')}
                style={{
                  padding: '12px',
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {t('relationships.compliment', 'Compliment')}
              </button>
              <button
                onClick={() => onInteract(selectedRel.id, 'give_gift')}
                style={{
                  padding: '12px',
                  backgroundColor: '#e65100',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                🎁 {t('relationships.giveGift', 'Give Gift')}
              </button>
              <button
                onClick={() => onInteract(selectedRel.id, 'insult')}
                style={{
                  padding: '12px',
                  backgroundColor: '#c62828',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {t('relationships.insult', 'Insult')}
              </button>

              {(selectedRel.type === 'Partner' ||
                selectedRel.type === 'Spouse' ||
                isFiance(selectedRel.type)) && (
                <>
                  <button
                    onClick={() => {
                      if (person.age < 18) {
                        showToast(
                          t('relationships.tooYoung', 'You are too young for this!'),
                          'bad'
                        );
                        return;
                      }
                      onInteract(selectedRel.id, 'make_love');
                    }}
                    style={{
                      padding: '12px',
                      backgroundColor: intimacyDisabled ? '#333' : '#ad1457',
                      color: intimacyDisabled ? '#666' : 'white',
                      cursor: intimacyDisabled ? 'not-allowed' : 'pointer',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                    disabled={intimacyDisabled}
                  >
                    {t('relationships.makeLove', 'Make Love')}{' '}
                    {person.lastIntimacyAge === person.age
                      ? localize('relationships.nextYear', ['(NEXT YEAR)', '(العام القادم)'])
                      : ''}
                  </button>
                  {selectedRel.type === 'Partner' && (
                    <button
                      onClick={() => {
                        if (person.age < 18) {
                          showToast(
                            t('relationships.tooYoungMarry', 'You are too young to marry!'),
                            'bad'
                          );
                          return;
                        }
                        handleActionClick('propose', selectedRel.id);
                      }}
                      style={{
                        padding: '12px',
                        backgroundColor: itemDisabled(18) ? '#333' : '#f57f17',
                        color: itemDisabled(18) ? '#666' : 'white',
                        cursor: itemDisabled(18) ? 'not-allowed' : 'pointer',
                        border: 'none',
                        borderRadius: '4px',
                      }}
                      disabled={itemDisabled(18)}
                    >
                      {t('relationships.propose', 'Propose')}
                    </button>
                  )}
                  {isFiance(selectedRel.type) && (
                    <button
                      onClick={() => handleActionClick('wedding', selectedRel.id)}
                      style={{
                        padding: '12px',
                        backgroundColor: '#ef6c00',
                        color: 'white',
                        cursor: 'pointer',
                        border: 'none',
                        borderRadius: '4px',
                      }}
                    >
                      {t('relationships.planWedding', 'Plan Wedding')}
                    </button>
                  )}
                  {(selectedRel.type === 'Partner' ||
                    selectedRel.type === 'Spouse' ||
                    isFiance(selectedRel.type)) && (
                    <button
                      onClick={() => onInteract(selectedRel.id, 'cheat')}
                      style={{
                        padding: '12px',
                        backgroundColor: '#4a148c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {t('relationships.cheat', 'Cheat')}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (selectedRel.type === 'Spouse') {
                        if (
                          confirm(
                            t(
                              'relationships.divorceConfirm',
                              'Are you sure you want to divorce? You will lose half your money.'
                            )
                          )
                        ) {
                          onInteract(selectedRel.id, 'divorce');
                          setSelectedRelId(null);
                        }
                      } else {
                        onInteract(selectedRel.id, 'break_up');
                        setSelectedRelId(null);
                      }
                    }}
                    style={{
                      padding: '12px',
                      backgroundColor: '#333',
                      border: '1px solid #c62828',
                      color: '#ef5350',
                      marginTop: '10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {selectedRel.type === 'Spouse'
                      ? t('relationships.divorce', 'Divorce')
                      : t('relationships.breakUp', 'Break Up')}
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {person.relationships.length === 0 ? (
              <p className="text-center" style={{ color: '#888' }}>
                {t('relationships.noRelationships', 'You have no relationships.')}
              </p>
            ) : (
              person.relationships.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => setSelectedRelId(rel.id)}
                  style={{
                    textAlign: 'left',
                    padding: '15px',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    backgroundColor: '#252525',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#303030')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#252525')}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div className="bold" style={{ color: '#fff', fontSize: '1.1em' }}>
                      {rel.name}
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#aaa' }}>
                      {relationshipTypeLabel(rel.type)}
                    </div>
                  </div>
                  <StatBar value={rel.stat} color={rel.stat > 50 ? '#4caf50' : '#ef5350'} />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
