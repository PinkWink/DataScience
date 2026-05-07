import { useState } from 'react'
import { loadCaseStudies, saveCaseStudies, resetCaseStudies } from '../data/caseStudies'
import {
  getAccessTokens,
  createAccessToken,
  revokeAccessToken,
  forceExpireToken,
  getAccessLogForToken,
  loadHeroConfig,
  saveHeroConfig,
  resetHeroConfig,
  clearAdminSession,
} from '../utils/crypto'

/* ─── Sub-editors ─── */

function MetricEditor({ metric, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-end">
      <Field label="라벨" value={metric.label} onChange={(v) => onChange({ ...metric, label: v })} />
      <Field label="Before" value={metric.before} type="number" onChange={(v) => onChange({ ...metric, before: parseFloat(v) || 0 })} />
      <Field label="After" value={metric.after} type="number" onChange={(v) => onChange({ ...metric, after: parseFloat(v) || 0 })} />
      <Field label="단위" value={metric.unit} onChange={(v) => onChange({ ...metric, unit: v })} className="w-20" />
      <button onClick={onRemove} className="shrink-0 px-2 py-2 text-red-400 hover:text-red-300 cursor-pointer">✕</button>
    </div>
  )
}

function ExperimentEditor({ exp, onChange, onRemove }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
      <div className="flex justify-between items-start">
        <Field label="제목" value={exp.title} onChange={(v) => onChange({ ...exp, title: v })} className="flex-1" />
        <button onClick={onRemove} className="shrink-0 ml-2 px-2 py-2 text-red-400 hover:text-red-300 cursor-pointer">✕</button>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">설명</label>
        <textarea
          value={exp.description}
          onChange={(e) => onChange({ ...exp, description: e.target.value })}
          rows={2}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white resize-y focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={type === 'number' ? 'any' : undefined}
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
      />
    </div>
  )
}

function CaseEditor({ study, onChange }) {
  const update = (key, value) => onChange({ ...study, [key]: value })
  const updateTab = (key, value) => onChange({ ...study, tabs: { ...study.tabs, [key]: value } })

  return (
    <div className="bg-gray-900 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{study.icon}</span>
        <h3 className="text-lg font-bold">{study.title || '새 케이스'}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="아이콘" value={study.icon} onChange={(v) => update('icon', v)} />
        <Field label="제목" value={study.title} onChange={(v) => update('title', v)} />
        <Field label="부제" value={study.subtitle} onChange={(v) => update('subtitle', v)} />
        <Field label="기간" value={study.period} onChange={(v) => update('period', v)} />
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-accent">탭 콘텐츠</h4>
        {[
          ['problem', '문제정의'],
          ['approach', 'ML접근'],
          ['results', '결과지표'],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs text-gray-500 mb-1">{label}</label>
            <textarea
              value={study.tabs[key]}
              onChange={(e) => updateTab(key, e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white resize-y focus:outline-none focus:border-accent"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-accent">Before → After 지표</h4>
          <button
            onClick={() => update('beforeAfter', [...study.beforeAfter, { label: '', before: 0, after: 0, unit: '' }])}
            className="text-xs text-accent hover:text-accent-light cursor-pointer"
          >
            + 추가
          </button>
        </div>
        {study.beforeAfter.map((m, i) => (
          <MetricEditor
            key={i}
            metric={m}
            onChange={(updated) => { const arr = [...study.beforeAfter]; arr[i] = updated; update('beforeAfter', arr) }}
            onRemove={() => update('beforeAfter', study.beforeAfter.filter((_, j) => j !== i))}
          />
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-accent">실패한 실험</h4>
          <button
            onClick={() => update('failedExperiments', [...study.failedExperiments, { title: '', description: '' }])}
            className="text-xs text-accent hover:text-accent-light cursor-pointer"
          >
            + 추가
          </button>
        </div>
        {study.failedExperiments.map((exp, i) => (
          <ExperimentEditor
            key={i}
            exp={exp}
            onChange={(updated) => { const arr = [...study.failedExperiments]; arr[i] = updated; update('failedExperiments', arr) }}
            onRemove={() => update('failedExperiments', study.failedExperiments.filter((_, j) => j !== i))}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Token Manager ─── */

function formatDate(ts) {
  return new Date(ts).toLocaleString('ko-KR', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function parseBrowser(ua) {
  if (!ua) return '알 수 없음'
  if (ua.includes('Edg/')) return 'Edge'
  if (ua.includes('Chrome/')) return 'Chrome'
  if (ua.includes('Firefox/')) return 'Firefox'
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari'
  return '기타'
}

function parseOS(ua) {
  if (!ua) return ''
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac OS')) return 'macOS'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('Linux')) return 'Linux'
  return ''
}

function TokenAccessLog({ tokenId }) {
  const logs = getAccessLogForToken(tokenId)

  if (logs.length === 0) {
    return <p className="text-xs text-gray-600 italic pl-2">접속 이력 없음</p>
  }

  return (
    <div className="space-y-1.5">
      {logs.slice().reverse().map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
          <span className="text-gray-300">{formatDate(entry.accessedAt)}</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-400">{parseBrowser(entry.userAgent)}</span>
          {parseOS(entry.userAgent) && (
            <>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">{parseOS(entry.userAgent)}</span>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function TokenManager() {
  const [tokens, setTokens] = useState(getAccessTokens)
  const [label, setLabel] = useState('')
  const [expiry, setExpiry] = useState('')
  const [newToken, setNewToken] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const refreshTokens = () => setTokens(getAccessTokens())

  const handleCreate = () => {
    if (!label.trim() || !expiry) return
    const token = createAccessToken(label.trim(), expiry)
    setNewToken(token)
    refreshTokens()
    setLabel('')
    setExpiry('')
  }

  const handleRevoke = (id) => {
    revokeAccessToken(id)
    refreshTokens()
  }

  const handleForceExpire = (id) => {
    if (window.confirm('이 토큰을 강제 만료 처리하시겠습니까?\n현재 접속 중인 사용자는 새로고침 시 재접속이 불가합니다.')) {
      forceExpireToken(id)
      refreshTokens()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(newToken)
  }

  const now = Date.now()

  return (
    <div className="bg-gray-900 rounded-xl p-5 space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <span className="text-accent">🔑</span> 접속 토큰 관리
      </h3>
      <p className="text-xs text-gray-500">만료 기한이 있는 접속 코드를 생성하여 방문자에게 공유하세요.</p>

      {/* Create new */}
      <div className="flex gap-2 items-end flex-wrap">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-gray-500 mb-1">라벨 (예: 리크루터A)</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
          />
        </div>
        <div className="min-w-[160px]">
          <label className="block text-xs text-gray-500 mb-1">만료일</label>
          <input
            type="datetime-local"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent [color-scheme:dark]"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={!label.trim() || !expiry}
          className="px-4 py-2 bg-accent hover:bg-accent-light disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm rounded-lg cursor-pointer"
        >
          생성
        </button>
      </div>

      {/* Newly created token display */}
      {newToken && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 space-y-2">
          <p className="text-xs text-accent font-medium">새 토큰이 생성되었습니다. 지금만 확인 가능합니다!</p>
          <div className="flex gap-2 items-center">
            <code className="flex-1 bg-gray-800 px-3 py-2 rounded text-sm font-mono text-white select-all break-all">{newToken}</code>
            <button onClick={handleCopy} className="shrink-0 px-3 py-2 bg-accent text-white text-xs rounded cursor-pointer">복사</button>
          </div>
          <button onClick={() => setNewToken('')} className="text-xs text-gray-400 hover:text-gray-200 cursor-pointer">닫기</button>
        </div>
      )}

      {/* Token list */}
      {tokens.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-300">발급된 토큰</h4>
          {tokens.map((t) => {
            const expired = t.expiresAt <= now || t.forceExpired
            const isExpanded = expandedId === t.id
            const logs = getAccessLogForToken(t.id)
            const accessCount = logs.length
            const lastAccess = accessCount > 0 ? logs[logs.length - 1].accessedAt : null

            let statusLabel, statusColor
            if (t.forceExpired) {
              statusLabel = '강제 만료'
              statusColor = 'text-orange-400'
            } else if (t.expiresAt <= now) {
              statusLabel = '기간 만료'
              statusColor = 'text-red-400'
            } else {
              statusLabel = `~${formatDate(t.expiresAt)}`
              statusColor = 'text-green-400'
            }

            return (
              <div key={t.id} className={`bg-gray-800/50 rounded-lg overflow-hidden ${expired ? 'opacity-60' : ''}`}>
                {/* Token header */}
                <div
                  className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800/80 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{t.label}</span>
                      <span className={`text-xs ${statusColor}`}>{statusLabel}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">
                        접속 {accessCount}회
                      </span>
                      {lastAccess && (
                        <span className="text-xs text-gray-600">
                          마지막: {formatDate(lastAccess)}
                        </span>
                      )}
                    </div>
                  </div>
                  <code className="text-xs text-gray-500 font-mono hidden sm:block">{t.token.slice(0, 8)}…</code>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {/* Expanded: access log + actions */}
                {isExpanded && (
                  <div className="px-4 pb-3 space-y-3 border-t border-gray-700/50">
                    <div className="pt-3">
                      <p className="text-xs font-medium text-gray-400 mb-2">접속 이력</p>
                      <TokenAccessLog tokenId={t.id} />
                    </div>

                    <div className="flex gap-2 pt-1">
                      {!expired && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleForceExpire(t.id) }}
                          className="px-3 py-1.5 text-xs border border-orange-800 rounded-lg hover:border-orange-500 text-orange-400 cursor-pointer"
                        >
                          강제 만료
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRevoke(t.id) }}
                        className="px-3 py-1.5 text-xs border border-red-800 rounded-lg hover:border-red-500 text-red-400 cursor-pointer"
                      >
                        완전 삭제
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Hero Editor ─── */

function HeroEditor() {
  const [hero, setHero] = useState(loadHeroConfig)
  const [saved, setSaved] = useState(false)

  const update = (key, value) => setHero((prev) => ({ ...prev, [key]: value }))

  const handleSave = () => {
    saveHeroConfig(hero)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (window.confirm('히어로 영역을 기본값으로 초기화하시겠습니까?')) {
      const defaults = resetHeroConfig()
      setHero(defaults)
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="text-accent">✨</span> 히어로 영역 편집
        </h3>
        <div className="flex gap-2">
          <button onClick={handleReset} className="px-3 py-1.5 text-xs border border-gray-700 rounded-lg hover:border-red-500 text-gray-300 cursor-pointer">
            초기화
          </button>
          <button onClick={handleSave} className="px-4 py-1.5 text-xs bg-accent hover:bg-accent-light text-white rounded-lg font-medium cursor-pointer">
            {saved ? '저장됨 ✓' : '저장'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">태그라인 (상단 작은 텍스트)</label>
          <input
            value={hero.tagline}
            onChange={(e) => update('tagline', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">헤드라인 (타이핑 애니메이션 텍스트)</label>
          <textarea
            value={hero.headline}
            onChange={(e) => update('headline', e.target.value)}
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white resize-y focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">서브타이틀</label>
          <textarea
            value={hero.subtitle}
            onChange={(e) => update('subtitle', e.target.value)}
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white resize-y focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">CTA 버튼 텍스트</label>
          <input
            value={hero.ctaText}
            onChange={(e) => update('ctaText', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="border border-gray-800 rounded-lg p-4 bg-gray-950/50">
        <p className="text-xs text-gray-500 mb-2">미리보기</p>
        <p className="text-accent text-xs font-medium tracking-wider uppercase">{hero.tagline}</p>
        <p className="text-lg font-bold mt-1">{hero.headline}</p>
        <p className="text-gray-400 text-sm mt-1">{hero.subtitle}</p>
        <span className="inline-block mt-2 px-4 py-1.5 bg-accent/20 text-accent text-xs rounded-full">{hero.ctaText}</span>
      </div>
    </div>
  )
}

/* ─── Main Admin ─── */

export default function Admin() {
  const [studies, setStudies] = useState(loadCaseStudies)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('cases') // 'cases' | 'hero' | 'tokens'

  const handleSave = () => {
    saveCaseStudies(studies)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (window.confirm('기본 데이터로 초기화하시겠습니까?')) {
      resetCaseStudies()
      setStudies(loadCaseStudies())
    }
  }

  const handleAdd = () => {
    setStudies([
      ...studies,
      {
        id: `case-${Date.now()}`,
        title: '',
        subtitle: '',
        period: '',
        icon: '📌',
        tabs: { problem: '', approach: '', results: '' },
        beforeAfter: [],
        failedExperiments: [],
      },
    ])
  }

  const handleRemoveCase = (index) => {
    if (window.confirm('이 케이스를 삭제하시겠습니까?')) {
      setStudies(studies.filter((_, i) => i !== index))
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(studies, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'caseStudies.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (Array.isArray(data)) {
          setStudies(data)
          saveCaseStudies(data)
        }
      } catch {
        alert('JSON 파일을 읽을 수 없습니다.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleLogout = () => {
    clearAdminSession()
    window.location.hash = ''
    window.location.reload()
  }

  const tabs = [
    { id: 'cases', label: '케이스 관리' },
    { id: 'hero', label: '히어로 편집' },
    { id: 'tokens', label: '접속 토큰' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <a href="#" className="text-gray-400 hover:text-white text-sm cursor-pointer">← 포트폴리오</a>
            <h1 className="text-base font-bold">Admin</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {tab === 'cases' && (
              <>
                <label className="px-3 py-1.5 text-xs border border-gray-700 rounded-lg hover:border-accent text-gray-300 cursor-pointer">
                  가져오기
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
                <button onClick={handleExport} className="px-3 py-1.5 text-xs border border-gray-700 rounded-lg hover:border-accent text-gray-300 cursor-pointer">
                  내보내기
                </button>
                <button onClick={handleReset} className="px-3 py-1.5 text-xs border border-gray-700 rounded-lg hover:border-red-500 text-gray-300 cursor-pointer">
                  초기화
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 text-xs bg-accent hover:bg-accent-light text-white rounded-lg font-medium cursor-pointer"
                >
                  {saved ? '저장됨 ✓' : '저장'}
                </button>
              </>
            )}
            <button onClick={handleLogout} className="px-3 py-1.5 text-xs border border-red-800 rounded-lg hover:border-red-500 text-red-400 cursor-pointer">
              로그아웃
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-3xl mx-auto px-4 flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                tab === t.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {tab === 'cases' && (
          <>
            {studies.map((study, i) => (
              <div key={study.id} className="relative">
                <button
                  onClick={() => handleRemoveCase(i)}
                  className="absolute -top-2 -right-2 z-10 w-7 h-7 bg-red-900/80 hover:bg-red-800 text-red-300 rounded-full text-xs flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
                <CaseEditor
                  study={study}
                  onChange={(updated) => {
                    const arr = [...studies]
                    arr[i] = updated
                    setStudies(arr)
                  }}
                />
              </div>
            ))}
            <button
              onClick={handleAdd}
              className="w-full py-4 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-accent hover:border-accent transition-colors cursor-pointer"
            >
              + 새 케이스 추가
            </button>
          </>
        )}

        {tab === 'hero' && <HeroEditor />}
        {tab === 'tokens' && <TokenManager />}
      </div>
    </div>
  )
}
