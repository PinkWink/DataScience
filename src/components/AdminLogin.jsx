import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  isAdminSetup,
  setupAdminPasscode,
  verifyAdminPasscode,
  createAdminSession,
} from '../utils/crypto'

export default function AdminLogin({ onSuccess }) {
  const [isSetup] = useState(isAdminSetup)
  const [passcode, setPasscode] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!passcode) return
    setLoading(true)
    setError('')

    await new Promise((r) => setTimeout(r, 300))

    const ok = await verifyAdminPasscode(passcode)
    if (ok) {
      createAdminSession()
      onSuccess()
    } else {
      setError('패스코드가 일치하지 않습니다.')
    }
    setLoading(false)
  }

  const handleSetup = async (e) => {
    e.preventDefault()
    if (!passcode || passcode.length < 8) {
      setError('패스코드는 최소 8자 이상이어야 합니다.')
      return
    }
    if (passcode !== confirm) {
      setError('패스코드가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    setError('')
    await setupAdminPasscode(passcode)
    createAdminSession()
    onSuccess()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">
              {isSetup ? 'Admin 로그인' : 'Admin 초기 설정'}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {isSetup
                ? '관리자 패스코드를 입력하세요'
                : '사용할 관리자 패스코드를 설정하세요'}
            </p>
          </div>

          <form onSubmit={isSetup ? handleLogin : handleSetup} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">패스코드</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => { setPasscode(e.target.value); setError('') }}
                placeholder={isSetup ? '패스코드 입력' : '8자 이상 입력'}
                autoFocus
                autoComplete="current-password"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/50 placeholder:text-gray-600"
              />
            </div>

            {!isSetup && (
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">패스코드 확인</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError('') }}
                  placeholder="패스코드 재입력"
                  autoComplete="new-password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/50 placeholder:text-gray-600"
                />
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !passcode}
              className="w-full py-3 bg-red-500 hover:bg-red-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              {loading ? '처리 중...' : isSetup ? '로그인' : '설정 완료'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">
            ← 포트폴리오로 돌아가기
          </a>
        </div>
      </motion.div>
    </div>
  )
}
