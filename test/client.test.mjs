import assert from 'node:assert/strict'

let loaded
const React = {
  createElement: () => null,
  useState: (initial) => [initial, () => {}],
  useEffect: () => {},
}
globalThis.document = {
  documentElement: { lang: 'zh-CN' },
  head: { appendChild() {} },
  createElement() {
    return { id: '', textContent: '', remove() {} }
  },
}
globalThis.window = {
  __ModuleLoader__: {
    load(entry) {
      loaded = entry
    },
  },
}

await import('../client.js')
assert.ok(loaded, 'client.js must register through the module loader')
assert.equal(loaded.id, 'dsh-session-title-stamp')
const exported = loaded.factory((specifier) => {
  if (specifier === 'react') return React
  throw new Error(`unexpected module ${specifier}`)
})
assert.deepEqual(exported.inject, ['slots', 'remote', 'remote.commands', 'locale'])

function makeContext({ menus } = {}) {
  const registrations = []
  const menuRegistrations = []
  const notifications = []
  const ctx = {
    effect(callback) {
      callback()
    },
    get(name) {
      return name === 'contextMenus' ? menus : undefined
    },
    inject(names, callback) {
      if (names.includes('configForms') && names.includes('slots')) {
        callback({
          configForms: {
            get: () => ({ getSnapshot: () => ({ status: 'loading' }), subscribe: () => () => {}, mutate: async () => true }),
          },
          slots: ctx.slots,
        })
      }
    },
    locale: {
      register() {},
      bind() {
        return (key) => key
      },
    },
    slots: {
      inject(_name, callback) {
        callback()
      },
      register(definition, component) {
        const entry = { definition, component, disposed: false }
        registrations.push(entry)
        return () => {
          entry.disposed = true
        }
      },
    },
    remote: {
      commands: {
        async execute() {
          return { ok: true, value: { result: { kind: 'success', text: 'ok' } } }
        },
      },
    },
  }
  const service = {
    register(definition) {
      menuRegistrations.push(definition)
      return () => {}
    },
    notify(message, ok) {
      notifications.push([message, ok])
    },
  }
  return { ctx, registrations, menuRegistrations, notifications, service }
}

// Host without the context-menu service (DSH 0.2.1): the legacy Slot row stays.
{
  const { ctx, registrations, menuRegistrations } = makeContext()
  exported.apply(ctx)
  assert.deepEqual(
    registrations.map(({ definition }) => definition.name),
    [
      'settings.section',
      'conversation.session.header.actions',
      'sidebar.workspaces.session.menu.item',
      'sidebar.workspaces.session.menu.item',
      'sidebar.session.row.hover',
    ],
  )
  assert.equal(menuRegistrations.length, 0)
  for (const entry of registrations) assert.equal(typeof entry.component, 'function')
}

// Host with the context-menu service (DSH 0.2.2+): one data action above the native rows.
{
  const { ctx, registrations, menuRegistrations, service } = makeContext()
  ctx.get = (name) => (name === 'contextMenus' ? service : undefined)
  exported.apply(ctx)
  assert.deepEqual(
    registrations.map(({ definition }) => definition.name),
    [
      'settings.section',
      'conversation.session.header.actions',
      'contextMenu.icon',
      'sidebar.workspaces.session.menu.item',
      'sidebar.session.row.hover',
    ],
  )
  const iconRegistration = registrations.find(({ definition }) => definition.name === 'contextMenu.icon')
  assert.equal(iconRegistration.definition.key, 'session-title-stamp.retitle')
  assert.equal(typeof iconRegistration.component, 'function')
  assert.equal(menuRegistrations.length, 1)
  const [menu] = menuRegistrations
  assert.equal(menu.id, 'session-title-stamp.retitle')
  assert.equal(menu.target, 'session')
  assert.ok(menu.order < 100, 'the retitle action must sort above Pin (100)')
  const actions = menu.resolve({ sessionId: 'session-1', displayTitle: '1027 | 修复 | 登录' })
  assert.equal(actions.length, 1)
  assert.equal(actions[0].label, 'menu')
  assert.equal(actions[0].icon.key, 'session-title-stamp.retitle')
  await actions[0].run()
}

// A host that gains the service later replaces the legacy row with the data action.
{
  const { ctx, registrations, menuRegistrations, service } = makeContext()
  ctx.inject = (names, callback) => {
    if (names.includes('configForms') && names.includes('slots')) {
      callback({ configForms: { get: () => ({ getSnapshot: () => ({ status: 'loading' }), subscribe: () => () => {}, mutate: async () => true }) }, slots: ctx.slots })
      return
    }
    if (names.includes('contextMenus')) callback({ contextMenus: service, slots: ctx.slots, effect: (fn) => fn() })
  }
  exported.apply(ctx)
  assert.equal(menuRegistrations.length, 1)
  const legacyRows = registrations.filter(({ definition }) => definition.name === 'sidebar.workspaces.session.menu.item')
  assert.equal(legacyRows.length, 2)
  assert.equal(legacyRows[0].definition.id, 'session-title-stamp-retitle')
  assert.equal(legacyRows[0].disposed, true, 'the legacy retitle row is removed when the data action registers')
  assert.equal(legacyRows[1].disposed, false, 'the copy-title row survives')
}

console.log('client tests passed')
