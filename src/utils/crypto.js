const ADMIN_KEY = 'portfolio_admin_hash'
const TOKENS_KEY = 'portfolio_access_tokens'
const ADMIN_SESSION_KEY = 'portfolio_admin_session'
const ACCESS_LOG_KEY = 'portfolio_access_log'
const HERO_KEY = 'portfolio_hero_config'

// --- PBKDF2 helpers (Web Crypto API) ---

async function deriveKey(password, salt) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 310000, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
  return Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function generateSalt() {
  const buf = new Uint8Array(32)
  crypto.getRandomValues(buf)
  return Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function generateToken() {
  const buf = new Uint8Array(24)
  crypto.getRandomValues(buf)
  return Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function generateSessionId() {
  return generateToken()
}

// --- Admin Passcode ---

export function isAdminSetup() {
  return !!localStorage.getItem(ADMIN_KEY)
}

export async function setupAdminPasscode(passcode) {
  const salt = generateSalt()
  const hash = await deriveKey(passcode, salt)
  localStorage.setItem(ADMIN_KEY, JSON.stringify({ salt, hash }))
}

export async function verifyAdminPasscode(passcode) {
  const stored = localStorage.getItem(ADMIN_KEY)
  if (!stored) return false
  const { salt, hash } = JSON.parse(stored)
  const attempt = await deriveKey(passcode, salt)
  return attempt === hash
}

export function createAdminSession() {
  const id = generateSessionId()
  const expires = Date.now() + 2 * 60 * 60 * 1000 // 2 hours
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ id, expires }))
}

export function isAdminSessionValid() {
  const raw = sessionStorage.getItem(ADMIN_SESSION_KEY)
  if (!raw) return false
  const { expires } = JSON.parse(raw)
  if (Date.now() > expires) {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    return false
  }
  return true
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

// --- Visitor Access Tokens ---

export function getAccessTokens() {
  try {
    const raw = localStorage.getItem(TOKENS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveAccessTokens(tokens) {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
}

export function createAccessToken(label, expiresAt) {
  const token = generateToken()
  const tokens = getAccessTokens()
  tokens.push({
    id: crypto.randomUUID(),
    label,
    token,
    createdAt: Date.now(),
    expiresAt: new Date(expiresAt).getTime(),
    forceExpired: false,
  })
  saveAccessTokens(tokens)
  return token
}

export function revokeAccessToken(id) {
  const tokens = getAccessTokens().filter((t) => t.id !== id)
  saveAccessTokens(tokens)
}

export function forceExpireToken(id) {
  const tokens = getAccessTokens().map((t) =>
    t.id === id ? { ...t, forceExpired: true } : t,
  )
  saveAccessTokens(tokens)
}

export function verifyAccessToken(input) {
  const tokens = getAccessTokens()
  const now = Date.now()
  const match = tokens.find(
    (t) => t.token === input && t.expiresAt > now && !t.forceExpired,
  )
  if (!match) return null
  return { id: match.id, label: match.label, expiresAt: match.expiresAt }
}

// --- Access Log ---

export function getAccessLog() {
  try {
    const raw = localStorage.getItem(ACCESS_LOG_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveAccessLog(log) {
  localStorage.setItem(ACCESS_LOG_KEY, JSON.stringify(log))
}

export function recordAccess(tokenId, tokenLabel) {
  const log = getAccessLog()
  log.push({
    tokenId,
    tokenLabel,
    accessedAt: Date.now(),
    userAgent: navigator.userAgent,
    language: navigator.language,
  })
  saveAccessLog(log)
}

export function getAccessLogForToken(tokenId) {
  return getAccessLog().filter((entry) => entry.tokenId === tokenId)
}

export function clearAccessLog() {
  localStorage.removeItem(ACCESS_LOG_KEY)
}

// --- Hero Config ---

const defaultHeroConfig = {
  tagline: 'PM Portfolio',
  headline: 'ML로 행동을 예측하고, LLM으로 대화를 설계합니다',
  subtitle: '데이터로 행동을 예측하고, 점점 더 사람에 가까운 AI를 만들어온 PM',
  ctaText: '케이스 보기',
}

export function loadHeroConfig() {
  try {
    const raw = localStorage.getItem(HERO_KEY)
    if (raw) return { ...defaultHeroConfig, ...JSON.parse(raw) }
  } catch {}
  return defaultHeroConfig
}

export function saveHeroConfig(config) {
  localStorage.setItem(HERO_KEY, JSON.stringify(config))
}

export function resetHeroConfig() {
  localStorage.removeItem(HERO_KEY)
  return defaultHeroConfig
}
