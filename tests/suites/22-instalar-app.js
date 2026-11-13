/* Ajustes → Instalar la app, y recarga automática cuando hay versión nueva. */
const SHP = process.env.SHP || '';
module.exports = {
  name: 'Instalar app y actualización',
  async run(t) {
    await t.seed();
    await t.case('Ajustes tiene la fila «Instalar la app»', async () => {
      await t.tap('[data-a="open-settings"]', 700);
      t.ok('fila en Ajustes', await t.page.evaluate(() => { const f = document.querySelector('#sheetbody > details.pwacc'); return !!f && /Instalar la app/.test(f.textContent); }));
      await t.page.evaluate(() => { document.querySelector('#sheetbody .pwacc').open = true; }); await t.wait(300);
      t.ok('sin aviso del navegador explica cómo instalar y ofrece buscar actualización', await t.page.evaluate(() => { const b = document.querySelector('#sheetbody .pwacc'); return /Instalar aplicación|Compartir/.test(b.textContent) && !!b.querySelector('[data-a="pw-check"]') && /se actualiza sola/.test(b.textContent); }));
      t.ok('no hay botón de instalar si el navegador no lo ofrece', !(await t.has('#sheetbody .pwacc [data-a="pw-install"]')));
    });
    await t.case('Cuando el navegador ofrece instalar, sale el botón y lo lanza', async () => {
      await t.page.evaluate(() => {
        const e = new Event('beforeinstallprompt', { cancelable: true });
        e.prompt = () => { window.__prompted = 1; }; e.userChoice = Promise.resolve({ outcome: 'accepted' });
        window.dispatchEvent(e);
      }); await t.wait(400);
      t.ok('aparece «Instalar en este móvil»', await t.has('#sheetbody .pwacc [data-a="pw-install"]'));
      t.ok('el subtítulo dice «un toque»', /un toque/.test(await t.T('#sheetbody .pwacc summary')));
      await t.shot(SHP + 'instalar-app');
      await t.tap('#sheetbody .pwacc [data-a="pw-install"]', 600);
      t.eq('se lanza el diálogo de instalación del navegador', await t.page.evaluate(() => window.__prompted), 1);
      t.ok('y el botón desaparece', !(await t.has('#sheetbody .pwacc [data-a="pw-install"]')));
    });
    await t.case('Versión nueva: se recarga sola, salvo que estés escribiendo', async () => {
      await t.page.evaluate(() => { window.__pwNoReload = true; window.__pw.had = true; window.__pw.rl = false; });
      await t.tap('[data-a="close-sheet"]', 400);
      await t.page.evaluate(() => navigator.serviceWorker.dispatchEvent(new Event('controllerchange'))); await t.wait(1600);
      t.eq('recarga una vez', await t.page.evaluate(() => window.__pwReloaded), 1);
      await t.page.evaluate(() => { window.__pw.rl = false; const i = document.createElement('input'); i.id = 'pwtmp'; document.body.appendChild(i); i.focus(); });
      await t.page.evaluate(() => navigator.serviceWorker.dispatchEvent(new Event('controllerchange'))); await t.wait(1600);
      t.eq('escribiendo no recarga', await t.page.evaluate(() => window.__pwReloaded), 1);
      t.ok('avisa con un botón «Actualizar»', await t.has('#toast [data-a="pw-reload"]'));
      await t.tap('#toast [data-a="pw-reload"]', 500);
      t.eq('y al tocarlo recarga', await t.page.evaluate(() => window.__pwReloaded), 2);
      await t.page.evaluate(() => { const i = document.getElementById('pwtmp'); i && i.remove(); });
    });
    await t.case('La primera instalación del service worker no recarga', async () => {
      await t.page.evaluate(() => { window.__pw.had = false; window.__pw.rl = false; window.__pwReloaded = 0; });
      await t.page.evaluate(() => navigator.serviceWorker.dispatchEvent(new Event('controllerchange'))); await t.wait(1500);
      t.eq('sin recarga', await t.page.evaluate(() => window.__pwReloaded), 0);
    });
  }
};
