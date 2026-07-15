// Business and Entrepreneurship System

export const BUSINESS_TYPES = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    startupCost: 50000,
    monthlyExpenses: 7000,
    revenueRange: [5000, 25000],
    maxEmployees: 15,
    sectors: ['Food & Beverage'],
  },
  {
    id: 'tech_startup',
    name: 'Tech Startup',
    startupCost: 100000,
    monthlyExpenses: 13000,
    revenueRange: [10000, 50000],
    maxEmployees: 30,
    sectors: ['Technology'],
    requiresDegree: ['Computer Science', 'Engineering'],
  },
  {
    id: 'retail_store',
    name: 'Retail Store',
    startupCost: 75000,
    monthlyExpenses: 9000,
    revenueRange: [8000, 30000],
    maxEmployees: 10,
    sectors: ['Retail'],
  },
  {
    id: 'consulting_firm',
    name: 'Consulting Firm',
    startupCost: 30000,
    monthlyExpenses: 16000,
    revenueRange: [15000, 60000],
    maxEmployees: 20,
    sectors: ['Professional Services'],
    requiresDegree: ['Finance', 'Business School'],
  },
  {
    id: 'real_estate_agency',
    name: 'Real Estate Agency',
    startupCost: 40000,
    monthlyExpenses: 20000,
    revenueRange: [10000, 80000],
    maxEmployees: 12,
    sectors: ['Real Estate'],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing Plant',
    startupCost: 500000,
    monthlyExpenses: 55000,
    revenueRange: [40000, 200000],
    maxEmployees: 100,
    sectors: ['Manufacturing'],
  },
];

export class Company {
  constructor(type, name, founderName) {
    const businessType = BUSINESS_TYPES.find(b => b.id === type);

    this.id = Date.now() + Math.random();
    this.name = typeof name === 'string' && name.trim() ? name.trim().slice(0, 80) : 'New Company';
    this.type = type;
    this.businessType = businessType;
    this.founder = founderName;
    this.age = 0; // years in business
    this.employees = 1; // founder
    this.valuation = businessType?.startupCost || 0;
    this.cash = (businessType?.startupCost || 0) * 0.5; // Start with 50% operating capital
    this.revenue = 0;
    this.expenses = businessType?.monthlyExpenses || 0;
    this.isPublic = false;
    this.stockPrice = null;
    this.ownerEquity = 1;
    this.reputation = 50; // 0-100
    this.growthRate = 1.0; // multiplier
  }

  static fromData(data) {
    if (!data || !BUSINESS_TYPES.some(type => type.id === data.type)) {
      return null;
    }
    const company = new Company(data.type, data.name, data.founder || 'Unknown');
    Object.assign(company, data);
    company.businessType = BUSINESS_TYPES.find(b => b.id === company.type) || company.businessType;
    company.cash = Math.floor(company.cash || 0);
    company.valuation = Math.floor(company.valuation || company.businessType?.startupCost || 0);
    company.employees = Math.max(1, company.employees || 1);
    company.reputation = Math.max(0, Math.min(100, company.reputation ?? 50));
    company.growthRate = company.growthRate || 1;
    company.ownerEquity = Math.max(0, Math.min(1, Number(company.ownerEquity ?? 1)));
    return company;
  }

  simulate(economy) {
    this.age++;

    // Calculate revenue based on economy and reputation
    const [minRev, maxRev] = this.businessType.revenueRange;
    let baseRevenue = Math.floor(Math.random() * (maxRev - minRev) + minRev);

    // Economy modifier
    if (economy === 'Boom') {
      baseRevenue *= 1.3;
    }
    if (economy === 'Recession') {
      baseRevenue *= 0.7;
    }

    // Reputation modifier
    const reputationMultiplier = this.reputation / 100;
    baseRevenue = Math.floor(baseRevenue * reputationMultiplier);

    // Staff adds capacity linearly. This prevents the exponential revenue
    // growth that previously made rapid hiring an unlimited-money exploit.
    const staffCapacity = 1 + Math.max(0, this.employees - 1) * 0.1;
    baseRevenue = Math.floor(baseRevenue * this.growthRate * staffCapacity);

    this.revenue = baseRevenue * 12; // Annual revenue
    const annualExpenses = this.expenses * 12;
    const profit = this.revenue - annualExpenses;
    this.lastProfit = profit;

    this.cash += profit;

    // Update valuation (simplified)
    if (profit > 0) {
      this.valuation = Math.floor(profit * 4); // Conservative small-business earnings multiple
      this.reputation = Math.min(100, this.reputation + 2);
    } else {
      this.valuation = Math.floor(Math.max(this.businessType.startupCost, this.valuation * 0.9));
      this.reputation = Math.max(0, this.reputation - 5);
    }

    // Stock price update if public
    if (this.isPublic && this.stockPrice) {
      const priceChange = (Math.random() - 0.3) * 10; // More likely to go up
      this.stockPrice = Math.max(1, this.stockPrice + priceChange);
    }

    return { profit, revenue: this.revenue, expenses: annualExpenses };
  }

  hireEmployee() {
    if (this.employees >= this.businessType.maxEmployees) {
      return { success: false, message: "You've reached maximum employees!" };
    }

    const hiringCost = 5000;
    if (this.cash < hiringCost) {
      return { success: false, message: 'Not enough cash to hire!' };
    }

    this.cash -= hiringCost;
    this.employees++;
    this.expenses += 2000; // Monthly salary/benefits in the simplified economy

    return { success: true, message: `Hired employee #${this.employees}!` };
  }

  fireEmployee() {
    if (this.employees <= 1) {
      return { success: false, message: "Can't fire yourself!" };
    }

    this.employees--;
    this.expenses = Math.max(this.businessType.monthlyExpenses, this.expenses - 2000);
    this.reputation = Math.max(0, this.reputation - 3);

    return { success: true, message: 'Employee laid off.' };
  }

  goPublic() {
    if (this.isPublic) {
      return { success: false, message: 'Already public!' };
    }

    if (this.valuation < 1000000) {
      return { success: false, message: 'Valuation too low for IPO. Need $1M+' };
    }

    this.isPublic = true;
    this.stockPrice = Math.floor(this.valuation / 1000000); // Simplified pricing

    // Sell 20% of the post-money company. The raise increases valuation, so
    // the founder's stake is not destroyed merely by completing the IPO.
    const dilution = 0.2;
    const ipoRaise = Math.floor((this.valuation * dilution) / (1 - dilution));
    this.cash += ipoRaise;
    this.valuation += ipoRaise;
    this.ownerEquity = Math.max(0, this.ownerEquity * (1 - dilution));

    return {
      success: true,
      message: `IPO successful! Raised $${ipoRaise.toLocaleString()}`,
      amount: ipoRaise,
    };
  }

  isBankrupt() {
    return this.cash < -50000 || (this.cash < 0 && this.age > 2);
  }
}

export function canStartBusiness(person, businessType) {
  const business = BUSINESS_TYPES.find(b => b.id === businessType);
  if (!business) {
    return { canStart: false, reason: 'Invalid business type' };
  }

  // Money check
  if (person.money < business.startupCost) {
    return {
      canStart: false,
      reason: `Need $${business.startupCost.toLocaleString()}`,
    };
  }

  // Degree requirement
  if (business.requiresDegree) {
    const hasDegree =
      person.degrees && person.degrees.some(d => business.requiresDegree.includes(d.type));
    if (!hasDegree) {
      return {
        canStart: false,
        reason: `Requires degree: ${business.requiresDegree.join(' or ')}`,
      };
    }
  }

  return { canStart: true };
}
