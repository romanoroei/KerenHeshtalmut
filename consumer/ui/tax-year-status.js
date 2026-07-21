import { getTaxDataContext } from '../data/tax-data.js';

const context = getTaxDataContext(new Date());

document.querySelectorAll('[data-tax-data-year]').forEach((element) => {
  element.textContent = String(context.dataYear);
});

document.querySelectorAll('[data-tax-year-status]').forEach((banner) => {
  banner.hidden = !context.isFallback;
  const message = banner.querySelector('span');
  if (message) message.textContent = context.message;
});

document.documentElement.dataset.requestedTaxYear = String(context.requestedYear);
document.documentElement.dataset.taxDataYear = String(context.dataYear);
