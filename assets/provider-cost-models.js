const labels = {employees:'Employee count',baseA:'Option A base charge',baseB:'Option B base charge',personA:'Option A employee charge',personB:'Option B employee charge',volume:'Payment volume',transactions:'Transaction count',rateA:'Option A percentage',rateB:'Option B percentage',fixedA:'Option A fixed fee',fixedB:'Option B fixed fee',monthlyA:'Option A monthly fee',monthlyB:'Option B monthly fee',hours:'Service hours',included:'Included hours',hourly:'Hourly rate',retainer:'Retainer',extra:'Excess-hour rate',includedA:'Tier A included transactions',includedB:'Tier B included transactions',extraA:'Tier A excess fee',extraB:'Tier B excess fee',seats:'Paid seat count',seatA:'Plan A seat charge',seatB:'Plan B seat charge',salary:'Compensation amount',rate:'Fee percentage',flat:'Flat fee',employer:'Employer cash costs',tools:'Tools cash cost',provider:'Provider fee',setup:'Setup cost',retained:'Retained cash cost',months:'Comparison months',setupA:'Option A setup',setupB:'Option B setup'};
const field = (value, label, { min = 0, max = Infinity, integer = false } = {}) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
    throw new Error(`${labels[label] || label} must be ${integer ? 'a whole number' : 'a number'} from ${min}${Number.isFinite(max) ? ` to ${max}` : ' or higher'}.`);
  }
  return value;
};
const money = (v, k) => field(v[k], k);
const count = (v, k) => field(v[k], k, { integer: true });
const pct = (v, k) => field(v[k], k, { max: 100 });
const row = (label, amount) => [label, amount, 'money'];
export const models = {
  payroll(v) {
    const people = count(v, 'employees');
    const a = money(v, 'baseA') + people * money(v, 'personA');
    const b = money(v, 'baseB') + people * money(v, 'personB');
    return [row('Option A monthly cost', a), row('Option B monthly cost', b), row('Option A annual cost', a * 12), row('Option B annual cost', b * 12), row('Annual A minus B', (a - b) * 12)];
  },
  processing(v) {
    const volume = money(v, 'volume'), transactions = count(v, 'transactions');
    const a = volume * pct(v, 'rateA') / 100 + transactions * money(v, 'fixedA') + money(v, 'monthlyA');
    const b = volume * pct(v, 'rateB') / 100 + transactions * money(v, 'fixedB') + money(v, 'monthlyB');
    return [row('Option A monthly processing cost', a), row('Option B monthly processing cost', b), row('Monthly A minus B', a - b)];
  },
  retainer(v) {
    const hours = money(v, 'hours'), included = money(v, 'included');
    const hourly = hours * money(v, 'hourly');
    const retainer = money(v, 'retainer') + Math.max(0, hours - included) * money(v, 'extra');
    return [row('Hourly arrangement for the month', hourly), row('Retainer plus excess hours for the month', retainer), row('Retainer arrangement minus hourly', retainer - hourly)];
  },
  bookkeeping(v) {
    const transactions = count(v, 'transactions'), includedA = count(v, 'includedA'), includedB = count(v, 'includedB');
    const a = money(v, 'baseA') + Math.max(0, transactions - includedA) * money(v, 'extraA');
    const b = money(v, 'baseB') + Math.max(0, transactions - includedB) * money(v, 'extraB');
    return [row('Tier A monthly cost', a), row('Tier B monthly cost', b), row('Monthly A minus B', a - b)];
  },
  seats(v) {
    const seats = count(v, 'seats');
    const a = money(v, 'baseA') + seats * money(v, 'seatA');
    const b = money(v, 'baseB') + seats * money(v, 'seatB');
    return [row('Plan A monthly cost', a), row('Plan B monthly cost', b), row('Annual A minus B', (a - b) * 12)];
  },
  recruiting(v) {
    const percentFee = money(v, 'salary') * pct(v, 'rate') / 100, flat = money(v, 'flat');
    return [row('Percentage fee for one hire', percentFee), row('Flat fee for one hire', flat), row('Percentage fee minus flat fee', percentFee - flat)];
  },
  staffing(v) {
    const internal = money(v, 'salary') + money(v, 'employer') + money(v, 'tools');
    const external = money(v, 'provider') * 12 + money(v, 'setup') + money(v, 'retained') * 12;
    return [row('First-year in-house cash cost', internal), row('First-year outsourced cash cost', external), row('First-year in-house minus outsourced', internal - external)];
  },
  setup(v) {
    const months = field(v.months, 'months', { min: 1, integer: true });
    const a = money(v, 'setupA') + months * money(v, 'monthlyA');
    const b = money(v, 'setupB') + months * money(v, 'monthlyB');
    return [row('Option A cost over the entered months', a), row('Option B cost over the entered months', b), row('Total A minus B', a - b), row('Option A average per month including setup', a / months), row('Option B average per month including setup', b / months)];
  }
};
export function calculate(id, values) {
  if (!Object.hasOwn(models, id)) throw new Error('Unknown calculator.');
  const result = models[id](values);
  if (result.some(([, value]) => !Number.isFinite(value))) throw new Error('These amounts are too large to calculate. Use smaller values.');
  return result;
}
