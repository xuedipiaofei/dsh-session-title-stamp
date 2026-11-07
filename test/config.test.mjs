import assert from 'node:assert/strict'
import { Config } from '../lib/index.js'

const plain = Config({})
assert.equal(plain.categoryPreset.get(), 'zh')
assert.equal(plain.categoryEmoji.get(), false)
assert.equal(plain.titleLanguage.get(), 'auto')
assert.equal(plain.maxTitleBytes.get(), 80)
assert.equal(plain.dateFormat.get(), 'MMDD')
assert.equal(plain.refreshOnTurnEnd.get(), true)
assert.equal(plain.refreshMinIntervalMs.get(), 120000)
assert.equal(plain.refreshMaxTurns.get(), 100)
assert.equal(plain.backfillOnStart.get(), false)
assert.equal(plain.maxNameChars.get(), 20)
assert.equal(plain.recentMessages.get(), 8)

const custom = Config({
  categoryPreset: 'en',
  categoryEmoji: true,
  titleLanguage: 'en',
  dateFormat: 'YYMM',
  template: '{topic} | {type}',
  refreshOnTurnEnd: false,
  refreshMinIntervalMs: 60000,
  refreshMaxTurns: 0,
  backfillOnStart: true,
  maxNameChars: 12,
  recentMessages: 4,
})
assert.equal(custom.categoryPreset.get(), 'en')
assert.equal(custom.categoryEmoji.get(), true)
assert.equal(custom.titleLanguage.get(), 'en')
assert.equal(custom.dateFormat.get(), 'YYMM')
assert.equal(custom.template.get(), '{topic} | {type}')
assert.equal(custom.refreshOnTurnEnd.get(), false)
assert.equal(custom.refreshMinIntervalMs.get(), 60000)
assert.equal(custom.refreshMaxTurns.get(), 0)
assert.equal(custom.backfillOnStart.get(), true)
assert.equal(custom.maxNameChars.get(), 12)
assert.equal(custom.recentMessages.get(), 4)

console.log('config tests passed')
