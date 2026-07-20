const toggle = document.getElementById('disclosureToggle');
const popover = document.getElementById('professionalDisclosure');
const closeButton = document.getElementById('disclosureClose');
const content = document.getElementById('professionalDisclosureContent');
const legacySection = document.querySelector('.legal-sections');
const disclosureBody = legacySection?.querySelector('.legal-card__body');

if (content && disclosureBody) content.append(disclosureBody);
legacySection?.remove();

function setOpen(open) {
  if (!popover || !toggle) return;
  popover.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  if (open) closeButton?.focus({ preventScroll: true });
  else toggle.focus({ preventScroll: true });
}

toggle?.addEventListener('click', () => setOpen(popover?.hidden ?? true));
closeButton?.addEventListener('click', () => setOpen(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && popover && !popover.hidden) setOpen(false);
});
document.addEventListener('click', (event) => {
  if (!popover || popover.hidden || popover.contains(event.target) || toggle?.contains(event.target)) return;
  setOpen(false);
});
