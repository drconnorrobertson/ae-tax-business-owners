import { calculate } from './provider-cost-models.js';
const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
for (const form of document.querySelectorAll('[data-provider-calculator]')) {
  const output = form.querySelector('[data-results]');
  function render() {
    output.replaceChildren();
    if (!form.reportValidity()) return;
    try {
      const values = {};
      for (const input of form.querySelectorAll('input[name]')) {
        if (!input.value.trim()) throw new Error('Complete every input before calculating.');
        values[input.name] = Number(input.value);
      }
      const list = document.createElement('dl');
      for (const [label, value] of calculate(form.dataset.providerCalculator, values)) {
        const term = document.createElement('dt'), description = document.createElement('dd');
        term.textContent = label; description.textContent = dollars.format(value);
        list.append(term, description);
      }
      output.append(list);
    } catch (error) {
      const message = document.createElement('p');
      message.textContent = error.message;
      output.append(message);
    }
  }
  form.addEventListener('input', () => { output.replaceChildren(); });
  form.addEventListener('submit', event => { event.preventDefault(); render(); });
  form.querySelector('button[type=submit]').disabled = false;
  render();
}
