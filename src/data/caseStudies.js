const STORAGE_KEY = 'portfolio_case_studies'

export const defaultCaseStudies = [
  {
    id: 'delivery-ml',
    title: '배달 ML',
    subtitle: '배달 시간 예측 모델 고도화',
    period: '2020 - 2021',
    icon: '🛵',
    tabs: {
      problem:
        '배달 예상 시간이 실제와 평균 15분 이상 차이나 고객 불만이 급증했습니다. 기존 규칙 기반 시스템은 날씨, 교통, 주문 밀집도 등 변수를 반영하지 못했고, CS 인입률이 월 12%에 달했습니다.',
      approach:
        'XGBoost 기반 배달 시간 예측 모델을 설계했습니다. 피처로 날씨 API, 실시간 교통 데이터, 주문 밀집도, 라이더 현재 위치를 활용했고, 시간대별 가중치를 적용한 앙상블 모델로 정확도를 높였습니다. A/B 테스트를 통해 단계적으로 트래픽을 이관했습니다.',
      results:
        '배달 예측 오차를 15분에서 4분으로 줄였고, 예측 정확도는 62%에서 94%로 향상되었습니다. CS 인입률은 12%에서 3.2%로 감소했습니다.',
    },
    beforeAfter: [
      { label: '예측 정확도', before: 62, after: 94, unit: '%' },
      { label: '예측 오차', before: 15, after: 4, unit: '분' },
      { label: 'CS 인입률', before: 12, after: 3.2, unit: '%' },
    ],
    failedExperiments: [
      {
        title: 'LSTM 시계열 모델 실패',
        description:
          '초기에 LSTM으로 시계열 예측을 시도했으나, 실시간 추론 속도가 500ms를 초과해 서비스 요구사항(100ms 이내)을 충족하지 못했습니다. XGBoost로 전환 후 20ms 이내 추론이 가능해졌습니다.',
      },
      {
        title: '날씨 피처 과적합',
        description:
          '날씨 데이터 30개 변수를 모두 투입했더니 과적합이 발생했습니다. 피처 임포턴스 분석 후 상위 5개만 선별하여 일반화 성능이 크게 개선되었습니다.',
      },
    ],
  },
  {
    id: 'content-recommendation',
    title: '콘텐츠 추천',
    subtitle: '개인화 콘텐츠 추천 시스템',
    period: '2021 - 2023',
    icon: '🎯',
    tabs: {
      problem:
        '월간 활성 사용자 대비 콘텐츠 소비율이 23%에 불과했습니다. 사용자들이 원하는 콘텐츠를 찾지 못해 평균 세션 시간이 2.1분으로 짧았고, 이탈률이 높았습니다.',
      approach:
        'Collaborative Filtering과 Content-Based 하이브리드 추천 모델을 구축했습니다. 사용자 행동 로그(클릭, 체류시간, 스크롤 깊이)를 실시간 처리하고, 콘텐츠 임베딩을 활용한 유사도 기반 추천을 결합했습니다. 콜드스타트 문제는 인기도 기반 폴백으로 해결했습니다.',
      results:
        '콘텐츠 소비율이 23%에서 58%로 증가했고, 평균 세션 시간은 2.1분에서 7.3분으로 늘었습니다. 구독 전환율은 4.1%에서 11.2%로 상승했습니다.',
    },
    beforeAfter: [
      { label: '콘텐츠 소비율', before: 23, after: 58, unit: '%' },
      { label: '평균 세션 시간', before: 2.1, after: 7.3, unit: '분' },
      { label: '구독 전환율', before: 4.1, after: 11.2, unit: '%' },
    ],
    failedExperiments: [
      {
        title: 'Matrix Factorization 단독 모델',
        description:
          'MF 단독으로는 콜드스타트 사용자에게 추천이 불가능했습니다. 신규 사용자 30%가 아무런 추천을 받지 못하는 문제가 있어, Content-Based 폴백을 추가했습니다.',
      },
      {
        title: '실시간 처리 아키텍처 변경',
        description:
          '초기 배치 처리(1시간 주기)에서 실시간 스트리밍으로 전환했으나, 인프라 비용이 3배 증가했습니다. 결국 5분 마이크로배치로 타협하여 비용 대비 효과를 최적화했습니다.',
      },
    ],
  },
  {
    id: 'ai-character',
    title: 'AI 캐릭터',
    subtitle: 'AI 캐릭터 대화 서비스',
    period: '2023 - 현재',
    icon: '🤖',
    tabs: {
      problem:
        '기존 챗봇은 정해진 시나리오 외 대화에서 부자연스러운 응답을 생성했습니다. 사용자 리텐션이 첫 주 40%에서 한 달 뒤 8%로 급락했고, 평균 대화 턴 수가 3.2회에 불과했습니다.',
      approach:
        'LLM 기반 캐릭터 시스템을 설계했습니다. 캐릭터별 페르소나(성격, 말투, 배경 스토리)를 시스템 프롬프트로 정의하고, Few-shot 예시로 일관성을 확보했습니다. 감정 상태 추적과 대화 맥락 관리를 위한 메모리 시스템을 구축했으며, 안전성을 위한 가드레일도 함께 설계했습니다.',
      results:
        '한 달 리텐션이 8%에서 34%로 상승했고, 평균 대화 턴 수는 3.2회에서 18.7회로 증가했습니다. 캐릭터 일관성 평가 점수는 사용자 설문 기준 4.2/5.0을 달성했습니다.',
    },
    beforeAfter: [
      { label: '월간 리텐션', before: 8, after: 34, unit: '%' },
      { label: '평균 대화 턴', before: 3.2, after: 18.7, unit: '회' },
      { label: '일관성 평가', before: 2.1, after: 4.2, unit: '/5.0' },
    ],
    failedExperiments: [
      {
        title: 'Fine-tuning vs Prompt Engineering',
        description:
          '초기에 캐릭터별 Fine-tuning을 시도했으나, 캐릭터 추가 시마다 학습 비용이 발생하고 유지보수가 어려웠습니다. 프롬프트 엔지니어링 방식으로 전환하여 새 캐릭터 출시를 2주에서 2시간으로 단축했습니다.',
      },
      {
        title: '긴 대화 맥락 유실',
        description:
          '토큰 제한으로 20턴 이상 대화 시 초기 맥락이 유실되었습니다. 요약 기반 메모리 시스템을 도입해 핵심 정보를 압축 저장하고, 필요시 검색하는 RAG 방식으로 해결했습니다.',
      },
    ],
  },
]

export function loadCaseStudies() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    // ignore parse errors
  }
  return defaultCaseStudies
}

export function saveCaseStudies(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetCaseStudies() {
  localStorage.removeItem(STORAGE_KEY)
}
