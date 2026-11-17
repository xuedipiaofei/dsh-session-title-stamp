/**
 * Browser half of dsh-session-title-stamp.
 *
 * Registers two seats:
 *   - a refresh button in the conversation header
 *     (`conversation.session.header.actions`)
 *   - a compact cost/duration line in the Session hover card
 *     (`sidebar.session.row.hover`)
 *
 * Hand-written module-loader bundle: React comes from the browser module
 * table, so this package has no client build step.
 */
window.__ModuleLoader__.load({
  id: 'dsh-session-title-stamp',
  factory(require) {
    const React = require('react')
    const { useEffect, useState } = React
    const h = React.createElement

    const NS = 'dsh-session-title-stamp'
    const SETTINGS_NAMESPACE = 'session-title-stamp'
    const STATS_PATH = '/api/session-title-stamp/stats'
    const inject = ['slots', 'remote', 'remote.commands', 'locale']
    const DICT = {
      zh: {
        menu: '自动生成标题',
        tip: '自动识别分类，生成「日期 | 分类 | 名称」标题',
        running: '会话运行中，稍后再试',
        duration: '耗时',
        estimate: '估算',
        copyTitle: '复制标题',
        copyHint: '复制完整会话标题',
        'settings.nav': '会话标题',
        'settings.title': '会话标题',
        'settings.intro': '让侧栏里的每个会话都有一个稳定、可扫读的名字。修改后立即对新生成的标题生效。',
        'settings.preview': '实时预览',
        'settings.previewHint': '开启 emoji 后',
        'settings.format': '标题格式',
        'settings.categoryLanguage': '分类语言',
        'settings.categoryLanguageHint': '中文使用「分析 / 实现 / 修复 / 优化…」，英文使用 Analysis / Build / Fix / Optimize…',
        'settings.titleLanguage': '标题语言',
        'settings.titleLanguageHint': '名称使用哪种语言；分类标签仍由上面的分类语言决定。',
        'settings.langAuto': '跟随对话',
        'settings.langZh': '中文',
        'settings.langEn': 'English',
        'settings.maxBytes': '标题最大字节数',
        'settings.maxBytesHint': '1–80，最终还受标题服务上限约束。',
        'settings.bytes': '字节',
        'settings.categoryEmoji': '分类 emoji 前缀',
        'settings.categoryEmojiHint': '为分类增加视觉标记；默认关闭，开启后会占用少量标题字节。',
        'settings.dateFormat': '日期格式',
        'settings.dateFormatHint': '日期由本地时间计算，不交给模型。',
        'settings.template': '标题模板',
        'settings.templateHint': '支持 {date}、{type}、{topic}，也可用 {YYYYMMDD}、{HHmm} 等。',
        'settings.auto': '自动重算',
        'settings.autoBadge': '默认开启',
        'settings.autoRefresh': '回答完成后自动重算',
        'settings.autoRefreshHint': '每个完成的 turn 结束后更新标题；fork、子代理和手动固定的标题会跳过。',
        'settings.minInterval': '最小刷新间隔',
        'settings.minIntervalHint': '避免首轮刚生成又再次调用模型。',
        'settings.minutes': '分钟',
        'settings.freeze': '消息数冻结',
        'settings.freezeHint': '超过该用户消息数后停止自动重算，0 表示不冻结。',
        'settings.messages': '条',
        'settings.backfill': '启动时补刷旧标题',
        'settings.backfillHint': '启动后修复仍是兜底标题的 live 会话；会额外调用模型，默认关闭。',
        'settings.advanced': '高级',
        'settings.advancedHint': '名称长度、最近消息数；其它参数请用设置右上角的「打开配置文件」。',
        'settings.nameLimit': '名称最大字符数',
        'settings.nameLimitHint': '标题名称部分的上限，最终还受标题字节上限约束。',
        'settings.recentMessages': '最近消息数',
        'settings.recentMessagesHint': '生成标题时包含最近多少条消息。',
        'settings.chars': '字符',
        'settings.restore': '恢复默认',
        'settings.dirty': '有未保存的修改',
        'settings.save': '保存',
        'settings.saving': '保存中…',
        'settings.saved': '已保存',
        'settings.failed': '保存失败',
        'settings.readOnly': '当前 profile 不接受配置写入。',
        'settings.loading': '正在读取配置…',
        'settings.unavailable': '当前 profile 里没有这个插件的配置项，这里没有可编辑的内容。请在插件页启用后重开。',
      },
      en: {
        menu: 'Generate title',
        tip: 'Detect the category and generate a DATE | CATEGORY | NAME title',
        running: 'Session is running; try again later',
        duration: 'Duration',
        estimate: 'est.',
        copyTitle: 'Copy title',
        copyHint: 'Copy the full session title',
        'settings.nav': 'Session titles',
        'settings.title': 'Session titles',
        'settings.intro': 'Give every row a stable, scannable name. Changes apply to titles generated after saving.',
        'settings.preview': 'Live preview',
        'settings.previewHint': 'With emoji',
        'settings.format': 'Title format',
        'settings.categoryLanguage': 'Category language',
        'settings.categoryLanguageHint': 'Chinese uses 分析 / 实现 / 修复 / 优化…; English uses Analysis / Build / Fix / Optimize…',
        'settings.titleLanguage': 'Title language',
        'settings.titleLanguageHint': 'Language for the name; category labels still follow the category language above.',
        'settings.langAuto': 'Follow chat',
        'settings.langZh': 'Chinese',
        'settings.langEn': 'English',
        'settings.maxBytes': 'Maximum title bytes',
        'settings.maxBytesHint': '1–80, still capped by the title service limit.',
        'settings.bytes': 'bytes',
        'settings.categoryEmoji': 'Category emoji prefix',
        'settings.categoryEmojiHint': 'Adds a visual marker and a few title bytes. Off by default.',
        'settings.dateFormat': 'Date format',
        'settings.dateFormatHint': 'The date is computed locally, never by the model.',
        'settings.template': 'Title template',
        'settings.templateHint': 'Supports {date}, {type}, {topic}, plus {YYYYMMDD}, {HHmm}, and more.',
        'settings.auto': 'Auto refresh',
        'settings.autoBadge': 'on by default',
        'settings.autoRefresh': 'Refresh after a completed turn',
        'settings.autoRefreshHint': 'Updates the title after each completed turn; forks, subagents, and manually pinned titles are skipped.',
        'settings.minInterval': 'Minimum interval',
        'settings.minIntervalHint': 'Avoids a second request right after the first title.',
        'settings.minutes': 'minutes',
        'settings.freeze': 'Freeze after',
        'settings.freezeHint': 'Stop automatic refreshes after this many user messages; 0 disables the freeze.',
        'settings.messages': 'messages',
        'settings.backfill': 'Backfill old titles on startup',
        'settings.backfillHint': 'Repairs live sessions still using a fallback title; calls the model extra. Off by default.',
        'settings.advanced': 'Advanced',
        'settings.advancedHint': 'Name length and recent messages; use “Open config file” in the top-right for everything else.',
        'settings.nameLimit': 'Maximum name characters',
        'settings.nameLimitHint': 'Caps the name before the title byte budget applies.',
        'settings.recentMessages': 'Recent messages',
        'settings.recentMessagesHint': 'How many recent messages are sent with the title request.',
        'settings.chars': 'chars',
        'settings.restore': 'Restore defaults',
        'settings.dirty': 'Unsaved changes',
        'settings.save': 'Save',
        'settings.saving': 'Saving…',
        'settings.saved': 'Saved',
        'settings.failed': 'Not saved',
        'settings.readOnly': 'This profile does not accept configuration writes.',
        'settings.loading': 'Reading configuration…',
        'settings.unavailable': 'This profile has no configuration entry for the plugin. Enable it and reopen this page.',
      },
    }

    function formatDuration(ms) {
      if (typeof ms !== 'number' || !Number.isFinite(ms) || ms < 0) return undefined
      const seconds = Math.round(ms / 1000)
      if (seconds < 60) return `${seconds}s`
      const minutes = Math.round(seconds / 60)
      if (minutes < 60) return `${minutes}m`
      const hours = Math.floor(minutes / 60)
      const rest = minutes % 60
      return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`
    }

    function formatCost(cny) {
      if (typeof cny !== 'number' || !Number.isFinite(cny) || cny < 0) return undefined
      if (cny < 0.01) return `≈¥${cny.toFixed(3)}`
      return `≈¥${cny.toFixed(2)}`
    }

    function formatTokens(tokens) {
      if (typeof tokens !== 'number' || !Number.isFinite(tokens) || tokens <= 0) return undefined
      if (tokens < 1000) return `${tokens}`
      if (tokens < 1_000_000) return `${(tokens / 1000).toFixed(1)}k`
      return `${(tokens / 1_000_000).toFixed(2)}M`
    }

    function RefreshIcon() {
      return h(
        'svg',
        {
          width: 14,
          height: 14,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
        h('path', { d: 'M13.5 8a5.5 5.5 0 1 1-1.6-3.9' }),
        h('path', { d: 'M13.5 2v4h-4' }),
      )
    }

    function RefreshAction({ sessionId, useSession, run, t }) {
      const [busy, setBusy] = useState(false)
      const [failed, setFailed] = useState(false)
      const running =
        typeof useSession === 'function' ? useSession((snapshot) => snapshot?.running === true) : false
      const disabled = busy || running || typeof sessionId !== 'string' || sessionId === ''

      const click = async () => {
        if (busy || disabled) return
        setBusy(true)
        setFailed(false)
        try {
          await run(sessionId)
        } catch (error) {
          console.warn('session-title-stamp: /retitle failed', error)
          setFailed(true)
          setTimeout(() => setFailed(false), 2500)
        } finally {
          setBusy(false)
        }
      }

      return h(
        'button',
        {
          type: 'button',
          className: 'dsh-title-refresh',
          disabled,
          title: running ? t('running') : t('tip'),
          'aria-label': t('menu'),
          onClick: click,
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 26,
            height: 26,
            padding: 0,
            border: 0,
            borderRadius: 7,
            background: 'transparent',
            color: failed
              ? 'var(--dsw-alias-state-error-primary, #f87171)'
              : 'var(--dsw-alias-label-secondary, #94a3b8)',
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled && !busy ? 0.45 : 1,
          },
        },
        busy ? h('span', { style: { fontSize: 12 } }, '…') : h(RefreshIcon),
      )
    }

    function HoverStats({ sessionId, t }) {
      const [data, setData] = useState(null)
      useEffect(() => {
        let cancelled = false
        setData(null)
        if (typeof sessionId !== 'string' || sessionId === '') return undefined
        const url = `${STATS_PATH}?sessionId=${encodeURIComponent(sessionId)}`
        fetch(url, { headers: { accept: 'application/json' } })
          .then((response) => (response.ok ? response.json() : undefined))
          .then((payload) => {
            if (!cancelled && payload?.ok === true) setData(payload)
          })
          .catch(() => undefined)
        return () => {
          cancelled = true
        }
      }, [sessionId])

      if (data === null) return null
      const duration = formatDuration(data.durationMs)
      const cost = formatCost(data.costCny)
      const tokens = formatTokens(data.tokens)
      const parts = [
        duration === undefined ? undefined : `${t('duration')} ${duration}`,
        cost === undefined ? undefined : `${t('estimate')} ${cost}`,
        tokens === undefined ? undefined : `${tokens} tokens`,
      ].filter(Boolean)
      if (parts.length === 0) return null
      return h(
        'div',
        {
          style: {
            marginTop: 6,
            color: 'var(--dsw-alias-label-tertiary, #94a3b8)',
            fontSize: 12,
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
          },
        },
        parts.join(' · '),
      )
    }

    function RegenerateMenuItem({ sessionId, useMenuOpenState, run, t }) {
      const menuState =
        typeof useMenuOpenState === 'function' ? useMenuOpenState() : null
      return h(
        'button',
        {
          type: 'button',
          role: 'menuitem',
          className: 'dsh-title-menu-item',
          title: t('tip'),
          onClick: async () => {
            if (Array.isArray(menuState) && typeof menuState[1] === 'function') {
              menuState[1](false)
            }
            try {
              await run(sessionId)
            } catch (error) {
              console.warn('session-title-stamp: /retitle failed', error)
            }
          },
        },
        h(
          'span',
          { className: 'dsh-title-menu-icon', 'aria-hidden': 'true' },
          h(RefreshIcon),
        ),
        h('span', null, t('menu')),
      )
    }

    function CopyIcon() {
      return h(
        'svg',
        {
          width: 14,
          height: 14,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
        h('rect', { x: 5, y: 4, width: 8, height: 9, rx: 1.5 }),
        h('path', { d: 'M11 4V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v7A1.5 1.5 0 0 0 3.5 12H5' }),
      )
    }

    function CopyTitleMenuItem({ displayTitle, useMenuOpenState, t }) {
      const menuState =
        typeof useMenuOpenState === 'function' ? useMenuOpenState() : null
      const disabled = typeof displayTitle !== 'string' || displayTitle === ''
      return h(
        'button',
        {
          type: 'button',
          role: 'menuitem',
          className: 'dsh-title-menu-item',
          disabled,
          title: t('copyHint'),
          onClick: async () => {
            if (disabled) return
            if (Array.isArray(menuState) && typeof menuState[1] === 'function') {
              menuState[1](false)
            }
            try {
              await navigator.clipboard.writeText(displayTitle)
            } catch (error) {
              console.warn('session-title-stamp: copy title failed', error)
            }
          },
        },
        h('span', { className: 'dsh-title-menu-icon', 'aria-hidden': 'true' }, h(CopyIcon)),
        h('span', null, t('copyTitle')),
      )
    }

    function useLocaleRevision(ctx) {
      const [, force] = React.useState(0)
      React.useEffect(() => {
        if (typeof ctx?.locale?.subscribe !== 'function') return undefined
        return ctx.locale.subscribe(() => force((value) => value + 1))
      }, [ctx])
    }

    const SETTINGS_STYLE = {
      page: { display: 'flex', flexDirection: 'column', maxWidth: '720px', color: 'var(--dsw-alias-label-primary, #e8e8ea)' },
      h2: { margin: '0 0 6px', fontSize: '18px', lineHeight: '26px', fontWeight: 600 },
      intro: { margin: '0 0 20px', fontSize: '13px', lineHeight: '20px', color: 'var(--dsw-alias-label-tertiary, #8b8d94)' },
      preview: { border: '1px solid var(--dsw-alias-border-l2, #33363d)', background: 'var(--dsw-alias-bg-layer-2, #15171b)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' },
      previewLabel: { fontSize: '11px', color: 'var(--dsw-alias-label-caption, #737985)', letterSpacing: '.06em', marginBottom: '6px' },
      previewTitle: { fontSize: '15px', lineHeight: '23px', color: 'var(--dsw-alias-label-primary, #fff)', fontWeight: 500, wordBreak: 'break-word' },
      section: { marginTop: '18px' },
      sectionTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--dsw-alias-label-caption, #737985)', letterSpacing: '.06em', textTransform: 'uppercase', margin: '0 0 2px' },
      badge: { fontSize: '10px', lineHeight: '16px', fontWeight: 400, color: 'var(--dsw-alias-state-success-primary, #65d39a)', border: '.5px solid var(--dsw-alias-state-success-primary, #65d39a)', borderRadius: '99px', padding: '1px 7px', letterSpacing: 0, textTransform: 'none' },
      previewRow: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' },
      previewGhost: { fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-caption, #737985)', whiteSpace: 'nowrap' },
      row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '15px 0', borderBottom: '.5px solid var(--dsw-alias-border-l2, #2b2e35)' },
      rowColumn: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px', padding: '15px 0', borderBottom: '.5px solid var(--dsw-alias-border-l2, #2b2e35)' },
      text: { minWidth: 0 },
      label: { fontSize: '13px', fontWeight: 500, lineHeight: '20px' },
      desc: { marginTop: '4px', fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary, #8b8d94)' },
      seg: { display: 'inline-flex', padding: '2px', border: '1px solid var(--dsw-alias-border-l2, #343842)', borderRadius: '9px', background: 'var(--dsw-alias-bg-layer-1, #191b20)', flex: 'none' },
      segButton: { border: 0, background: 'transparent', color: 'var(--dsw-alias-label-secondary, #9a9da6)', font: 'inherit', fontSize: '12px', padding: '5px 11px', borderRadius: '7px', cursor: 'pointer' },
      segButtonOn: { background: 'var(--dsw-alias-interactive-bg-hover, #2d3340)', color: 'var(--dsw-alias-label-primary, #fff)' },
      switch: (on) => ({ width: '40px', height: '23px', borderRadius: '999px', background: on ? 'var(--dsw-alias-brand-primary, #6f96ff)' : 'var(--dsw-alias-border-l2, #3a3f49)', position: 'relative', flex: 'none', border: 0, cursor: 'pointer', padding: 0 }),
      thumb: (on) => ({ position: 'absolute', top: '2px', left: on ? '19px' : '2px', width: '19px', height: '19px', borderRadius: '50%', background: '#fff', transition: 'left 120ms ease' }),
      input: { background: 'var(--dsw-alias-bg-layer-1, #17191e)', border: '1px solid var(--dsw-alias-border-l2, #383c46)', borderRadius: '7px', color: 'var(--dsw-alias-label-primary, #eceef2)', font: 'inherit', fontSize: '12px', padding: '6px 9px' },
      number: { width: '64px', textAlign: 'right' },
      fullInput: { width: '100%', boxSizing: 'border-box', fontFamily: '"SF Mono", ui-monospace, monospace' },
      unit: { fontSize: '12px', color: 'var(--dsw-alias-label-caption, #737985)' },
      num: { display: 'flex', alignItems: 'center', gap: '7px', flex: 'none' },
      advanced: { display: 'flex', alignItems: 'center', gap: '7px', border: 0, background: 'transparent', color: 'var(--dsw-alias-label-caption, #737985)', font: 'inherit', fontSize: '12px', padding: '14px 0 0', cursor: 'pointer', textAlign: 'left' },
      footer: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px' },
      restore: { border: 0, background: 'transparent', color: 'var(--dsw-alias-label-secondary, #9a9da6)', font: 'inherit', fontSize: '12px', marginRight: 'auto', padding: 0, cursor: 'pointer' },
      save: { border: '1px solid transparent', background: 'var(--dsw-alias-label-primary, #e8e8ea)', color: 'var(--dsw-alias-bg-layer-3, #15171b)', borderRadius: '8px', font: 'inherit', fontSize: '13px', fontWeight: 600, padding: '7px 18px', cursor: 'pointer' },
      status: { fontSize: '12px', lineHeight: '18px' },
    }

    function buildSettingsSection(React, configForms, t, ctx) {
      const h = React.createElement
      const DEFAULT_TEMPLATE = '{date} | {type} | {topic}'
      const readText = (key) => t(`settings.${key}`)
      const sample = (preset, emoji, dateFormat, template, titleLanguage) => {
        const base = preset === 'en' ? 'Optimize' : '优化'
        const type = emoji ? `⚡ ${base}` : base
        const topicLanguage = titleLanguage === 'auto' ? (preset === 'en' ? 'en' : 'zh') : titleLanguage
        const topic = topicLanguage === 'en' ? 'Reduce renderer memory usage' : '降低渲染器内存占用'
        const date = dateFormat === 'YYMM' ? '2610' : dateFormat === 'YYYYMMDD' ? '20261027' : '1027'
        const values = { date, type, topic, MMDD: '1027', YYMM: '2610', YYYYMMDD: '20261027', HHmm: '1230', YYYY: '2026', YY: '26', MM: '10', DD: '27', HH: '12', mm: '30', ss: '00' }
        return (template || DEFAULT_TEMPLATE).replace(/\{([A-Za-z]+)\}/g, (match, key) => values[key] ?? match)
      }

      return function SessionTitleSettings() {
        const form = React.useMemo(() => configForms.get(SETTINGS_NAMESPACE), [])
        const [snapshot, setSnapshot] = React.useState(() => form.getSnapshot())
        React.useEffect(() => form.subscribe(() => setSnapshot(form.getSnapshot())), [form])
        useLocaleRevision(ctx)

        const stored = snapshot.value ?? {}
        const storedPreset = stored.categoryPreset === 'en' ? 'en' : 'zh'
        const storedEmoji = stored.categoryEmoji === true
        const storedTitleLanguage = ['zh', 'en'].includes(stored.titleLanguage) ? stored.titleLanguage : 'auto'
        const storedDateFormat = ['MMDD', 'YYMM', 'YYYYMMDD'].includes(stored.dateFormat) ? stored.dateFormat : 'MMDD'
        const storedTemplate = typeof stored.template === 'string' && stored.template.trim() !== '' ? stored.template.trim() : DEFAULT_TEMPLATE
        const storedAuto = stored.refreshOnTurnEnd !== false
        const storedMinutes = String(Math.max(0, Math.round((Number(stored.refreshMinIntervalMs) || 120000) / 60000)))
        const storedFreeze = String(Number.isFinite(stored.refreshMaxTurns) ? stored.refreshMaxTurns : 100)
        const storedBackfill = stored.backfillOnStart === true
        const storedNameChars = String(Number.isFinite(stored.maxNameChars) ? stored.maxNameChars : 20)
        const storedRecent = String(Number.isFinite(stored.recentMessages) ? stored.recentMessages : 8)
        const storedMaxTitleBytes = String(Number.isFinite(stored.maxTitleBytes) ? stored.maxTitleBytes : 80)

        const [categoryPreset, setCategoryPreset] = React.useState(storedPreset)
        const [categoryEmoji, setCategoryEmoji] = React.useState(storedEmoji)
        const [titleLanguage, setTitleLanguage] = React.useState(storedTitleLanguage)
        const [dateFormat, setDateFormat] = React.useState(storedDateFormat)
        const [template, setTemplate] = React.useState(storedTemplate)
        const [autoRefresh, setAutoRefresh] = React.useState(storedAuto)
        const [minutes, setMinutes] = React.useState(storedMinutes)
        const [freeze, setFreeze] = React.useState(storedFreeze)
        const [backfill, setBackfill] = React.useState(storedBackfill)
        const [nameChars, setNameChars] = React.useState(storedNameChars)
        const [recentMessages, setRecentMessages] = React.useState(storedRecent)
        const [maxTitleBytes, setMaxTitleBytes] = React.useState(storedMaxTitleBytes)
        const [advancedOpen, setAdvancedOpen] = React.useState(false)
        const [saveState, setSaveState] = React.useState('idle')

        React.useEffect(() => {
          setCategoryPreset(storedPreset)
          setCategoryEmoji(storedEmoji)
          setTitleLanguage(storedTitleLanguage)
          setDateFormat(storedDateFormat)
          setTemplate(storedTemplate)
          setAutoRefresh(storedAuto)
          setMinutes(storedMinutes)
          setFreeze(storedFreeze)
          setBackfill(storedBackfill)
          setNameChars(storedNameChars)
          setRecentMessages(storedRecent)
          setMaxTitleBytes(storedMaxTitleBytes)
        }, [snapshot.revision])

        const busy = saveState === 'saving'
        const writable = snapshot.writable !== false
        const dirty =
          categoryPreset !== storedPreset ||
          categoryEmoji !== storedEmoji ||
          titleLanguage !== storedTitleLanguage ||
          dateFormat !== storedDateFormat ||
          template !== storedTemplate ||
          autoRefresh !== storedAuto ||
          minutes !== storedMinutes ||
          freeze !== storedFreeze ||
          backfill !== storedBackfill ||
          nameChars !== storedNameChars ||
          recentMessages !== storedRecent ||
          maxTitleBytes !== storedMaxTitleBytes

        const row = (key, title, desc, control, column = false) =>
          h(
            'div',
            { key, style: column ? SETTINGS_STYLE.rowColumn : SETTINGS_STYLE.row },
            h('div', { style: SETTINGS_STYLE.text }, h('div', { style: SETTINGS_STYLE.label }, title), desc ? h('div', { style: SETTINGS_STYLE.desc }, desc) : null),
            control,
          )

        const segment = (options, value, onChange) =>
          h(
            'div',
            { style: SETTINGS_STYLE.seg, role: 'radiogroup' },
            options.map((option) =>
              h(
                'button',
                {
                  key: option.value,
                  type: 'button',
                  role: 'radio',
                  'aria-checked': value === option.value,
                  disabled: !writable || busy,
                  onClick: () => onChange(option.value),
                  style: { ...SETTINGS_STYLE.segButton, ...(value === option.value ? SETTINGS_STYLE.segButtonOn : {}) },
                },
                option.label,
              ),
            ),
          )

        const toggle = (checked, onChange, label) =>
          h(
            'button',
            { type: 'button', role: 'switch', 'aria-checked': checked, 'aria-label': label, disabled: !writable || busy, onClick: () => onChange(!checked), style: SETTINGS_STYLE.switch(checked) },
            h('span', { style: SETTINGS_STYLE.thumb(checked) }),
          )

        const number = (value, onChange, min, max, unit) =>
          h(
            'div',
            { style: SETTINGS_STYLE.num },
            h('input', { type: 'number', min, max, value, disabled: !writable || busy, onChange: (event) => onChange(event.target.value), style: { ...SETTINGS_STYLE.input, ...SETTINGS_STYLE.number } }),
            unit === undefined ? null : h('span', { style: SETTINGS_STYLE.unit }, unit),
          )

        const save = async () => {
          if (busy) return
          setSaveState('saving')
          const parsedMinutes = Math.max(0, Math.min(3600000, Math.round(Number.parseInt(minutes, 10) || 0) * 60000))
          const parsedFreeze = Math.max(0, Math.min(100000, Number.parseInt(freeze, 10) || 0))
          const parsedName = Math.max(4, Math.min(40, Number.parseInt(nameChars, 10) || 20))
          const parsedRecent = Math.max(2, Math.min(20, Number.parseInt(recentMessages, 10) || 8))
          const parsedMaxTitleBytes = Math.max(1, Math.min(80, Number.parseInt(maxTitleBytes, 10) || 80))
          const nextTemplate = template.trim() === '' ? DEFAULT_TEMPLATE : template.trim()
          try {
            const ok = await form.mutate(
              [
                { op: 'set', path: ['categoryPreset'], value: categoryPreset },
                { op: 'set', path: ['categoryEmoji'], value: categoryEmoji },
                { op: 'set', path: ['titleLanguage'], value: titleLanguage },
                { op: 'set', path: ['dateFormat'], value: dateFormat },
                { op: 'set', path: ['template'], value: nextTemplate },
                { op: 'set', path: ['refreshOnTurnEnd'], value: autoRefresh },
                { op: 'set', path: ['refreshMinIntervalMs'], value: parsedMinutes },
                { op: 'set', path: ['refreshMaxTurns'], value: parsedFreeze },
                { op: 'set', path: ['backfillOnStart'], value: backfill },
                { op: 'set', path: ['maxNameChars'], value: parsedName },
                { op: 'set', path: ['recentMessages'], value: parsedRecent },
                { op: 'set', path: ['maxTitleBytes'], value: parsedMaxTitleBytes },
              ],
              snapshot.revision,
            )
            setSaveState(ok === false ? 'failed' : 'saved')
          } catch {
            setSaveState('failed')
          }
        }

        const restore = () => {
          setCategoryPreset('zh')
          setCategoryEmoji(false)
          setTitleLanguage('auto')
          setDateFormat('MMDD')
          setTemplate(DEFAULT_TEMPLATE)
          setAutoRefresh(true)
          setMinutes('2')
          setFreeze('100')
          setBackfill(false)
          setNameChars('20')
          setRecentMessages('8')
          setMaxTitleBytes('80')
          setSaveState('idle')
        }

        if (snapshot.status === 'loading') return h('div', { style: SETTINGS_STYLE.desc }, readText('loading'))
        if (snapshot.status === 'unavailable') return h('div', { style: SETTINGS_STYLE.desc }, readText('unavailable'))

        const preview = sample(categoryPreset, categoryEmoji, dateFormat, template, titleLanguage)
        return h(
          'div',
          { style: SETTINGS_STYLE.page },
          h('h2', { style: SETTINGS_STYLE.h2 }, readText('title')),
          h('p', { style: SETTINGS_STYLE.intro }, readText('intro')),
          h(
            'div',
            { style: SETTINGS_STYLE.preview },
            h('div', { style: SETTINGS_STYLE.previewLabel }, readText('preview')),
            h(
              'div',
              { style: SETTINGS_STYLE.previewRow },
              h('div', { style: SETTINGS_STYLE.previewTitle }, preview),
              categoryEmoji
                ? null
                : h('span', { style: SETTINGS_STYLE.previewGhost }, `${readText('previewHint')}：⚡ ${categoryPreset === 'en' ? 'Optimize' : '优化'}`),
            ),
          ),
          h('div', { style: SETTINGS_STYLE.sectionTitle }, readText('format')),
          row('preset', readText('categoryLanguage'), readText('categoryLanguageHint'),
            segment([{ value: 'zh', label: '中文' }, { value: 'en', label: 'English' }], categoryPreset, setCategoryPreset)),
          row('language', readText('titleLanguage'), readText('titleLanguageHint'),
            segment([{ value: 'auto', label: readText('langAuto') }, { value: 'zh', label: readText('langZh') }, { value: 'en', label: readText('langEn') }], titleLanguage, setTitleLanguage)),
          row('emoji', readText('categoryEmoji'), readText('categoryEmojiHint'), toggle(categoryEmoji, setCategoryEmoji, readText('categoryEmoji'))),
          row('date', readText('dateFormat'), readText('dateFormatHint'),
            segment([{ value: 'MMDD', label: 'MMDD' }, { value: 'YYMM', label: 'YYMM' }, { value: 'YYYYMMDD', label: 'YYYYMMDD' }], dateFormat, setDateFormat)),
          row('template', readText('template'), readText('templateHint'),
            h('input', { value: template, disabled: !writable || busy, onChange: (event) => setTemplate(event.target.value), spellCheck: false, style: { ...SETTINGS_STYLE.input, ...SETTINGS_STYLE.fullInput } }), true),
          h('div', { style: SETTINGS_STYLE.sectionTitle }, readText('auto'), h('span', { style: SETTINGS_STYLE.badge }, readText('autoBadge'))),
          row('auto', readText('autoRefresh'), readText('autoRefreshHint'), toggle(autoRefresh, setAutoRefresh, readText('autoRefresh'))),
          row('minutes', readText('minInterval'), readText('minIntervalHint'), number(minutes, setMinutes, 0, 60, readText('minutes'))),
          row('freeze', readText('freeze'), readText('freezeHint'), number(freeze, setFreeze, 0, 100000, readText('messages'))),
          row('backfill', readText('backfill'), readText('backfillHint'), toggle(backfill, setBackfill, readText('backfill'))),
          h(
            'button',
            { type: 'button', style: SETTINGS_STYLE.advanced, onClick: () => setAdvancedOpen((value) => !value) },
            h('span', { style: { fontSize: 10, transform: advancedOpen ? 'rotate(90deg)' : 'rotate(-90deg)', display: 'inline-block' } }, '▼'),
            readText('advanced'),
          ),
          advancedOpen
            ? h('div', null,
              row('nameChars', readText('nameLimit'), readText('nameLimitHint'), number(nameChars, setNameChars, 4, 40, readText('chars'))),
              row('recent', readText('recentMessages'), readText('recentMessagesHint'), number(recentMessages, setRecentMessages, 2, 20, readText('messages'))),
              row('bytes', readText('maxBytes'), readText('maxBytesHint'), number(maxTitleBytes, setMaxTitleBytes, 1, 80, readText('bytes'))),
              h('div', { style: { ...SETTINGS_STYLE.desc, marginTop: '8px' } }, readText('advancedHint')),
            )
            : null,
          h(
            'div',
            { style: SETTINGS_STYLE.footer },
            h('button', { type: 'button', style: SETTINGS_STYLE.restore, disabled: !writable || busy, onClick: restore }, readText('restore')),
            h('span', { style: { ...SETTINGS_STYLE.status, color: saveState === 'failed' ? 'var(--dsw-alias-state-error-primary, #f87171)' : 'var(--dsw-alias-state-success-primary, #65d39a)' } }, saveState === 'saved' ? readText('saved') : saveState === 'failed' ? readText('failed') : ''),
            dirty && saveState !== 'saved' ? h('span', { style: { ...SETTINGS_STYLE.desc, marginTop: 0 } }, readText('dirty')) : null,
            writable ? null : h('span', { style: { ...SETTINGS_STYLE.desc, marginTop: 0 } }, readText('readOnly')),
            h('button', { type: 'button', style: { ...SETTINGS_STYLE.save, opacity: writable && !busy ? 1 : 0.4, cursor: writable && !busy ? 'pointer' : 'default' }, disabled: !writable || busy, onClick: () => void save() }, busy ? readText('saving') : readText('save')),
          ),
        )
      }
    }

    function registerSettingsPage(ctx, t) {
      try {
        if (typeof ctx.inject !== 'function') return
        ctx.inject(['configForms', 'slots'], (scope) => {
          try {
            const Section = buildSettingsSection(React, scope.configForms, t, ctx)
            scope.slots.inject('settings.section', () => scope.slots.register({
              name: 'settings.section',
              id: NS,
              order: 60,
              label: () => t('settings.nav'),
            }, Section))
          } catch (error) {
            console.warn('session-title-stamp: settings page unavailable', error)
          }
        })
      } catch (error) {
        console.warn('session-title-stamp: settings page unavailable', error)
      }
    }

    const STYLE_ID = 'dsh-session-title-stamp-style'


    function installStyle(ctx) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = `
.dsh-title-menu-item{display:flex;align-items:center;gap:6px;width:100%;min-height:34px;padding:6px 8px;border:0;border-radius:var(--dsw-radius-md);background:transparent;color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:20px;font-weight:400;text-align:left;cursor:pointer;box-sizing:border-box}
.dsh-title-menu-item:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.06))}
.dsh-title-menu-icon{display:inline-flex;flex:none;width:14px;height:14px;align-items:center;justify-content:center;color:var(--dsw-alias-menu-icon,var(--dsw-alias-label-tertiary,#94a3b8))}
.dsh-title-menu-icon svg{width:14px;height:14px}
.dsh-title-menu-item > span:last-child{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
`
      document.head.appendChild(style)
      ctx.effect?.(() => () => style.remove())
    }

    const SESSION_MENU_ICON_KEY = 'session-title-stamp.retitle'

    /** The context-menu service exists from DSH 0.2.2 on; older hosts keep the legacy Slot row. */
    function sessionMenuService(ctx) {
      try {
        return typeof ctx.get === 'function' ? ctx.get('contextMenus') : undefined
      } catch {
        return undefined
      }
    }

    function registerSessionMenuAction(scope, menus, { run, t }) {
      try {
        scope.slots.inject('contextMenu.icon', () =>
          scope.slots.register({ name: 'contextMenu.icon', key: SESSION_MENU_ICON_KEY }, RefreshIcon),
        )
        scope.effect?.(() =>
          menus.register({
            id: 'session-title-stamp.retitle',
            target: 'session',
            order: 10,
            resolve: ({ sessionId }) => [
              {
                id: 'retitle',
                label: t('menu'),
                icon: { key: SESSION_MENU_ICON_KEY },
                run: async () => {
                  try {
                    await run(sessionId)
                  } catch (error) {
                    menus.notify?.(String(error?.message ?? error), false)
                  }
                },
              },
            ],
          }),
        )
        return true
      } catch (error) {
        console.warn('session-title-stamp: context menu unavailable, keeping the Slot row', error)
        return false
      }
    }

    function apply(ctx) {
      installStyle(ctx)
      ctx.effect?.(() => ctx.locale.register(NS, DICT))
      const t = ctx.locale.bind(NS)
      registerSettingsPage(ctx, t)
      const run = async (sessionId) => {
        const response = await ctx.remote.commands.execute(sessionId, '/retitle', [])
        if (!response?.ok) {
          throw new Error(response?.error?.message ?? 'title command failed')
        }
        const outcome = response.value?.result
        if (outcome?.kind !== 'success') {
          throw new Error(outcome?.text ?? 'title command returned no result')
        }
        return outcome.text
      }

      ctx.slots.inject('conversation.session.header.actions', () =>
        ctx.slots.register(
          {
            name: 'conversation.session.header.actions',
            id: 'session-title-stamp-refresh',
            order: 40,
            inject: () => ({ run, t }),
          },
          RefreshAction,
        ),
      )

      const menus = sessionMenuService(ctx)
      let dataMenu = typeof menus?.register === 'function' ? registerSessionMenuAction(ctx, menus, { run, t }) : false
      if (!dataMenu) {
        let disposeLegacyMenu
        ctx.slots.inject('sidebar.workspaces.session.menu.item', () => {
          if (dataMenu) return undefined
          disposeLegacyMenu = ctx.slots.register(
            {
              name: 'sidebar.workspaces.session.menu.item',
              id: 'session-title-stamp-retitle',
              order: 0,
              inject: () => ({ run, t }),
            },
            RegenerateMenuItem,
          )
          return disposeLegacyMenu
        })
        ctx.inject?.(['contextMenus'], (scope) => {
          if (dataMenu) return
          const service = scope.contextMenus ?? sessionMenuService(scope)
          if (typeof service?.register !== 'function') return
          if (!registerSessionMenuAction(scope, service, { run, t })) return
          dataMenu = true
          disposeLegacyMenu?.()
        })
      }

      ctx.slots.inject('sidebar.workspaces.session.menu.item', () =>
        ctx.slots.register(
          {
            name: 'sidebar.workspaces.session.menu.item',
            id: 'session-title-stamp-copy',
            order: 460,
            inject: () => ({ t }),
          },
          CopyTitleMenuItem,
        ),
      )

      ctx.slots.inject('sidebar.session.row.hover', () =>
        ctx.slots.register(
          {
            name: 'sidebar.session.row.hover',
            id: 'session-title-stamp-stats',
            order: 0,
            inject: () => ({ t }),
          },
          HoverStats,
        ),
      )
    }

    return { inject, apply }
  },
})
