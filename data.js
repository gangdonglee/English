/* =========================================================================
   9급 공무원(전산직) 영어 학습 데이터
   - VOCAB   : 빈출 영단어
   - GRAMMAR : 빈출 문법 포인트 + 문제
   - READING : 독해 지문 + 문제
   ========================================================================= */

/* ----------------------------- 어휘 ----------------------------- */
const VOCAB = [
  { word: "abolish",        pos: "v",   meaning: "폐지하다",            ex: `The government decided to abolish the old tax law.` },
  { word: "abundant",       pos: "adj", meaning: "풍부한",              ex: `The region has abundant natural resources.` },
  { word: "accelerate",     pos: "v",   meaning: "가속하다",            ex: `New policies will accelerate economic growth.` },
  { word: "accommodate",    pos: "v",   meaning: "수용하다",            ex: `The hall can accommodate up to 500 people.` },
  { word: "acquire",        pos: "v",   meaning: "획득하다, 습득하다",  ex: `She acquired fluency in three languages.` },
  { word: "adverse",        pos: "adj", meaning: "불리한, 부정적인",    ex: `Smoking has adverse effects on health.` },
  { word: "advocate",       pos: "v/n", meaning: "옹호하다; 지지자",    ex: `He advocates for environmental protection.` },
  { word: "aggravate",      pos: "v",   meaning: "악화시키다",          ex: `Stress can aggravate the symptoms.` },
  { word: "alleviate",      pos: "v",   meaning: "완화하다",            ex: `The medicine helps alleviate pain.` },
  { word: "ambiguous",      pos: "adj", meaning: "애매모호한",          ex: `His ambiguous answer confused everyone.` },
  { word: "anticipate",     pos: "v",   meaning: "예상하다",            ex: `We anticipate a rise in prices.` },
  { word: "apparent",       pos: "adj", meaning: "명백한",              ex: `It was apparent that he was lying.` },
  { word: "appropriate",    pos: "adj", meaning: "적절한",              ex: `Choose appropriate clothes for the interview.` },
  { word: "arbitrary",      pos: "adj", meaning: "임의적인, 독단적인",  ex: `The decision seemed arbitrary and unfair.` },
  { word: "assess",         pos: "v",   meaning: "평가하다",            ex: `We need to assess the situation carefully.` },
  { word: "attribute",      pos: "v",   meaning: "~의 탓으로 돌리다",   ex: `She attributes her success to hard work.` },
  { word: "authentic",      pos: "adj", meaning: "진짜의, 진정한",      ex: `The museum displays authentic artifacts.` },
  { word: "beneficial",     pos: "adj", meaning: "유익한",              ex: `Exercise is beneficial to health.` },
  { word: "cease",          pos: "v",   meaning: "중단하다",            ex: `The factory ceased production last year.` },
  { word: "coherent",       pos: "adj", meaning: "일관성 있는",         ex: `He gave a coherent explanation.` },
  { word: "compensate",     pos: "v",   meaning: "보상하다",            ex: `The company will compensate workers for overtime.` },
  { word: "compile",        pos: "v",   meaning: "편집하다, 모으다",    ex: `She compiled a list of useful websites.` },
  { word: "comply",         pos: "v",   meaning: "따르다, 준수하다",    ex: `All firms must comply with the law.` },
  { word: "comprehensive",  pos: "adj", meaning: "포괄적인",            ex: `The report gives a comprehensive overview.` },
  { word: "conceal",        pos: "v",   meaning: "숨기다",              ex: `He could not conceal his disappointment.` },
  { word: "concise",        pos: "adj", meaning: "간결한",              ex: `Please keep your answer concise.` },
  { word: "condemn",        pos: "v",   meaning: "비난하다",            ex: `Many people condemned the violence.` },
  { word: "conform",        pos: "v",   meaning: "순응하다, 따르다",    ex: `Students are expected to conform to the rules.` },
  { word: "consequence",    pos: "n",   meaning: "결과",                ex: `He had to face the consequences of his actions.` },
  { word: "conserve",       pos: "v",   meaning: "보존하다, 아끼다",    ex: `We must conserve energy and water.` },
  { word: "contemporary",   pos: "adj", meaning: "동시대의, 현대의",    ex: `This is a museum of contemporary art.` },
  { word: "contradict",     pos: "v",   meaning: "모순되다",            ex: `His statement contradicts the evidence.` },
  { word: "controversial",  pos: "adj", meaning: "논란이 많은",         ex: `It is a highly controversial topic.` },
  { word: "crucial",        pos: "adj", meaning: "중요한, 결정적인",    ex: `This is a crucial moment in the project.` },
  { word: "deceive",        pos: "v",   meaning: "속이다",              ex: `He deceived investors with false reports.` },
  { word: "deliberate",     pos: "adj", meaning: "고의적인; 신중한",    ex: `It was a deliberate attempt to mislead.` },
  { word: "deteriorate",    pos: "v",   meaning: "악화되다",            ex: `Her health began to deteriorate.` },
  { word: "deter",          pos: "v",   meaning: "단념시키다, 억제하다",ex: `The fine is meant to deter speeding.` },
  { word: "diligent",       pos: "adj", meaning: "부지런한",            ex: `She is a diligent and reliable worker.` },
  { word: "diminish",       pos: "v",   meaning: "줄어들다",            ex: `Interest in the topic has diminished.` },
  { word: "distinct",       pos: "adj", meaning: "뚜렷한, 별개의",      ex: `There are three distinct types.` },
  { word: "distort",        pos: "v",   meaning: "왜곡하다",            ex: `The media distorted the facts.` },
  { word: "diverse",        pos: "adj", meaning: "다양한",              ex: `The city has a diverse population.` },
  { word: "dwindle",        pos: "v",   meaning: "점점 줄어들다",       ex: `Their savings slowly dwindled away.` },
  { word: "eligible",       pos: "adj", meaning: "자격이 있는",         ex: `Are you eligible for the scholarship?` },
  { word: "eliminate",      pos: "v",   meaning: "제거하다",            ex: `We aim to eliminate all errors.` },
  { word: "emphasize",      pos: "v",   meaning: "강조하다",            ex: `The teacher emphasized the importance of reading.` },
  { word: "endure",         pos: "v",   meaning: "견디다",              ex: `They had to endure great hardship.` },
  { word: "enhance",        pos: "v",   meaning: "향상시키다",          ex: `The new software enhances performance.` },
  { word: "enormous",       pos: "adj", meaning: "거대한",              ex: `The project required an enormous budget.` },
  { word: "essential",      pos: "adj", meaning: "필수적인",            ex: `Water is essential for life.` },
  { word: "evident",        pos: "adj", meaning: "분명한",              ex: `Her talent was evident from an early age.` },
  { word: "exempt",         pos: "adj/v", meaning: "면제된; 면제하다",  ex: `Students are exempt from the fee.` },
  { word: "exploit",        pos: "v",   meaning: "이용하다; 착취하다",  ex: `Companies should not exploit workers.` },
  { word: "fatigue",        pos: "n",   meaning: "피로",                ex: `He was overcome by fatigue.` },
  { word: "feasible",       pos: "adj", meaning: "실현 가능한",         ex: `Is the plan financially feasible?` },
  { word: "fluctuate",      pos: "v",   meaning: "변동하다",            ex: `Prices fluctuate with demand.` },
  { word: "fundamental",    pos: "adj", meaning: "근본적인",            ex: `There is a fundamental difference between them.` },
  { word: "hinder",         pos: "v",   meaning: "방해하다",            ex: `Bad weather hindered the rescue.` },
  { word: "hypothesis",     pos: "n",   meaning: "가설",                ex: `The experiment confirmed the hypothesis.` },
  { word: "imminent",       pos: "adj", meaning: "임박한",              ex: `A storm is imminent.` },
  { word: "impartial",      pos: "adj", meaning: "공정한",              ex: `A judge must be impartial.` },
  { word: "implement",      pos: "v",   meaning: "시행하다",            ex: `The city will implement the new policy.` },
  { word: "incentive",      pos: "n",   meaning: "동기, 장려책",        ex: `Tax cuts are an incentive to invest.` },
  { word: "inevitable",     pos: "adj", meaning: "불가피한",            ex: `Change is inevitable.` },
  { word: "inhibit",        pos: "v",   meaning: "억제하다",            ex: `Fear can inhibit learning.` },
  { word: "integrate",      pos: "v",   meaning: "통합하다",            ex: `We integrated the two systems.` },
  { word: "intricate",      pos: "adj", meaning: "복잡한",              ex: `The watch has an intricate design.` },
  { word: "justify",        pos: "v",   meaning: "정당화하다",          ex: `Nothing can justify such cruelty.` },
  { word: "legitimate",     pos: "adj", meaning: "합법적인, 정당한",    ex: `He has a legitimate claim.` },
  { word: "mitigate",       pos: "v",   meaning: "완화하다",            ex: `We need measures to mitigate climate change.` },
  { word: "negligible",     pos: "adj", meaning: "무시해도 될 만한",    ex: `The cost is negligible.` },
  { word: "obsolete",       pos: "adj", meaning: "구식의",              ex: `The technology is now obsolete.` },
  { word: "obstacle",       pos: "n",   meaning: "장애물",              ex: `They overcame every obstacle.` },
  { word: "plausible",      pos: "adj", meaning: "그럴듯한",            ex: `That is a plausible explanation.` },
  { word: "precise",        pos: "adj", meaning: "정확한",              ex: `We need precise measurements.` },
  { word: "prevalent",      pos: "adj", meaning: "만연한",              ex: `The disease is prevalent in the area.` },
  { word: "prohibit",       pos: "v",   meaning: "금지하다",            ex: `Smoking is prohibited here.` },
  { word: "prominent",      pos: "adj", meaning: "두드러진, 저명한",    ex: `She is a prominent scientist.` },
  { word: "reluctant",      pos: "adj", meaning: "꺼리는, 마지못한",    ex: `He was reluctant to leave.` },
  { word: "resilient",      pos: "adj", meaning: "회복력 있는",         ex: `Children are remarkably resilient.` },
  { word: "retain",         pos: "v",   meaning: "유지하다, 보유하다",  ex: `The soil retains water well.` },
  { word: "scrutinize",     pos: "v",   meaning: "면밀히 조사하다",     ex: `Auditors scrutinize the accounts.` },
  { word: "sufficient",     pos: "adj", meaning: "충분한",              ex: `We have sufficient funds.` },
  { word: "tedious",        pos: "adj", meaning: "지루한",              ex: `The work was tedious and repetitive.` },
  { word: "tentative",      pos: "adj", meaning: "잠정적인",            ex: `We made a tentative plan.` },
  { word: "thrive",         pos: "v",   meaning: "번성하다",            ex: `The business is thriving.` },
  { word: "undermine",      pos: "v",   meaning: "약화시키다",          ex: `Scandals undermined public trust.` },
  { word: "vague",          pos: "adj", meaning: "모호한",              ex: `He gave only a vague answer.` },
  { word: "versatile",      pos: "adj", meaning: "다재다능한, 다용도의",ex: `She is a versatile performer.` },
];

/* ----------------------------- 문법 ----------------------------- */
/* points: 개념 정리 카드 / questions: 4지선다 문제 (answer = 정답 index) */
const GRAMMAR = {
  points: [
    {
      title: "가정법 (Subjunctive)",
      body: `• 가정법 과거: If + 주어 + 과거동사 ~, 주어 + would/could/might + 동사원형 (현재 사실의 반대)
• 가정법 과거완료: If + 주어 + had p.p ~, 주어 + would/could/might + have p.p (과거 사실의 반대)
• If 생략 시 도치: Were I you ~ / Had I known ~
• I wish + 가정법, as if + 가정법, It's time + 주어 + 과거동사`,
    },
    {
      title: "시제 (Tenses)",
      body: `• 현재완료(have p.p): 과거~현재의 경험·계속·완료·결과. 명백한 과거 부사(yesterday, ago, last~)와 함께 못 씀.
• 과거완료(had p.p): 과거의 특정 시점보다 더 이전(대과거).
• 시간·조건 부사절에서는 미래 대신 현재시제: When he comes(○) / When he will come(✕).`,
    },
    {
      title: "수의 일치 (Agreement)",
      body: `• 주어가 핵심 명사. 「each / every / one of + 복수명사」는 단수 취급.
• 「the number of + 복수명사」는 단수, 「a number of + 복수명사」는 복수.
• 부분 표현(most, some, half, the rest of) + 명사 → 명사에 수 일치.`,
    },
    {
      title: "to부정사 vs 동명사",
      body: `• 동명사만 목적어: enjoy, finish, avoid, mind, give up, consider, deny, postpone.
• to부정사만 목적어: want, hope, decide, plan, expect, refuse, agree, promise.
• 의미가 달라지는 동사: remember/forget/regret/try + to(미래·시도) vs ~ing(과거·실제로 함).`,
    },
    {
      title: "분사 / 분사구문",
      body: `• 현재분사(~ing): 능동·진행. 과거분사(p.p): 수동·완료.
• 감정동사: 사물·원인 → ~ing(boring), 사람·감정 → p.p(bored).
• 분사구문: 부사절의 접속사+주어 생략 후 동사를 ~ing/p.p로. (Being 생략 가능)`,
    },
    {
      title: "관계사 (Relatives)",
      body: `• 주격/목적격 관계대명사 who, which, that. 소유격 whose.
• 「전치사 + 관계대명사」 뒤에는 완전한 절. that은 전치사 뒤·계속적 용법에 못 씀.
• 관계부사 where/when/why/how는 뒤에 완전한 절. (선행사 + 관계부사 = in which 등)`,
    },
    {
      title: "도치 (Inversion)",
      body: `• 부정어(Never, Hardly, Not only, Little)가 문두 → 「조동사 + 주어」 도치.
• Only + 부사(구/절)가 문두 → 도치.
• So/Neither + 동사 + 주어: "~도 그렇다 / ~도 아니다".`,
    },
    {
      title: "비교 구문 (Comparison)",
      body: `• 원급: as + 원급 + as. 비교급: -er/more ~ than. 최상급: the + -est/most.
• 비교급 강조: much, far, even, still, a lot (very ✕).
• the 비교급 ~, the 비교급 ... : "~할수록 더 …하다".`,
    },
    {
      title: "병치 구조 (Parallelism)",
      body: `• 등위접속사(and, but, or)와 상관접속사(both A and B, not only A but also B, either A or B)는 같은 문법 형태를 연결.
• A is more about X than (about) Y 처럼 비교 대상도 형태 일치.`,
    },
    {
      title: "수동태 (Passive)",
      body: `• be + p.p (+ by 행위자). 자동사(occur, happen, appear, consist of)는 수동태 불가.
• 4형식 수동태: 간접목적어·직접목적어 각각 주어 가능.
• 지각·사역동사 수동태: 원형부정사가 to부정사로 (was made to go).`,
    },
    {
      title: "접속사 vs 전치사",
      body: `• 뒤에 「주어+동사」(절) → 접속사: because, although, while, when.
• 뒤에 명사(구) → 전치사: because of, despite/in spite of, during.
• during(전치사) vs while(접속사), despite(전치사) vs although(접속사) 구분.`,
    },
    {
      title: "대명사 / 재귀대명사",
      body: `• 대명사는 가리키는 명사와 수·인칭 일치. 단수 명사를 they로 받지 않도록 주의.
• 주어와 목적어가 같으면 재귀대명사(himself). 강조 용법은 생략 가능.
• it(가주어/가목적어) vs they, that of(반복 명사 대체) 구분.`,
    },
  ],
  questions: [
    { q: "If I ______ rich, I would travel around the world.", options: ["am", "were", "have been", "will be"], answer: 1, exp: "현재 사실의 반대인 가정법 과거. If절에 were를 사용." },
    { q: "______ I known about the meeting, I would have attended.", options: ["If", "Had", "Have", "Did"], answer: 1, exp: "가정법 과거완료에서 If 생략 시 도치: Had + 주어 + p.p." },
    { q: "She has lived in Seoul ______ 2010.", options: ["for", "since", "during", "ago"], answer: 1, exp: "현재완료 + since + 시점. for는 기간과 함께 쓴다." },
    { q: "By the time we arrived, the train ______.", options: ["leaves", "has left", "had left", "will leave"], answer: 2, exp: "과거(arrived)보다 더 이전의 일 → 과거완료 had p.p." },
    { q: "Each of the students ______ a different opinion.", options: ["have", "has", "are having", "were"], answer: 1, exp: "「each of + 복수명사」는 단수 취급 → has." },
    { q: "The number of applicants ______ increasing every year.", options: ["are", "is", "have", "were"], answer: 1, exp: "「the number of ~」는 단수 취급 → is." },
    { q: "He finally finished ______ the report last night.", options: ["to write", "writing", "write", "written"], answer: 1, exp: "finish는 동명사를 목적어로 취한다." },
    { q: "They decided ______ the project until next month.", options: ["postponing", "to postpone", "postpone", "postponed"], answer: 1, exp: "decide는 to부정사를 목적어로 취한다." },
    { q: "The movie was so ______ that I fell asleep.", options: ["bored", "boring", "bore", "to bore"], answer: 1, exp: "사물·원인이 지루함을 유발 → 현재분사 boring." },
    { q: "______ from the hill, the village looks peaceful.", options: ["Seeing", "Seen", "To see", "Having seen"], answer: 1, exp: "마을이 '보여지는' 수동 관계 → 과거분사 Seen (분사구문)." },
    { q: "This is the house ______ I was born.", options: ["which", "that", "where", "what"], answer: 2, exp: "뒤에 완전한 절 + 장소 선행사 → 관계부사 where." },
    { q: "Never ______ such a beautiful sunset.", options: ["I have seen", "have I seen", "I saw", "did I saw"], answer: 1, exp: "부정어 Never가 문두 → 조동사+주어 도치: have I seen." },
    { q: "This problem is ______ difficult than the previous one.", options: ["very", "much more", "very more", "so"], answer: 1, exp: "비교급 강조는 much(very 불가). more difficult 강조." },
    { q: "The teacher asked us to read carefully and ______ the main idea.", options: ["summarizing", "to summarize", "summarized", "summarize"], answer: 3, exp: "to read와 병치 → (to) summarize, 등위 연결에서 to 생략 가능." },
    { q: "The accident ______ near the station yesterday.", options: ["was occurred", "occurred", "is occurred", "has been occurred"], answer: 1, exp: "occur는 자동사라 수동태 불가 → occurred." },
    { q: "______ the heavy rain, the game was not canceled.", options: ["Although", "Despite", "Because", "While"], answer: 1, exp: "뒤에 명사구(the heavy rain) → 전치사 Despite." },
    { q: "______ he was tired, he kept working.", options: ["Despite", "In spite of", "Although", "Because of"], answer: 2, exp: "뒤에 절(he was tired) → 접속사 Although." },
    { q: "Tom hurt ______ while playing soccer.", options: ["him", "himself", "his", "he"], answer: 1, exp: "주어와 목적어가 동일 → 재귀대명사 himself." },
    { q: "Not only ______ the exam, but he also got the highest score.", options: ["he passed", "did he pass", "he did pass", "passed he"], answer: 1, exp: "Not only가 문두 → 도치: did he pass." },
    { q: "The climate of Korea is milder than ______ of Russia.", options: ["this", "it", "that", "those"], answer: 2, exp: "앞의 단수명사 climate 반복을 피하는 지시대명사 that." },
    { q: "If she ______ harder, she would have passed.", options: ["studied", "had studied", "studies", "has studied"], answer: 1, exp: "과거 사실의 반대 → 가정법 과거완료 had studied." },
    { q: "A number of students ______ waiting outside.", options: ["is", "was", "are", "has been"], answer: 2, exp: "「a number of + 복수명사」는 복수 취급 → are." },
    { q: "I look forward to ______ from you soon.", options: ["hear", "hearing", "heard", "be heard"], answer: 1, exp: "look forward to의 to는 전치사 → 동명사 hearing." },
    { q: "It is essential that he ______ present at the meeting.", options: ["is", "be", "was", "will be"], answer: 1, exp: "주장·요구·제안·필요(essential) 뒤 that절은 (should) + 동사원형 → be." },
  ],
};

/* ----------------------------- 독해 ----------------------------- */
/* 각 지문: passage(영문) / title(한글 설명) / questions[{q, options, answer, exp}] */
const READING = [
  {
    title: "지문 1 · 인공지능과 일자리",
    passage: `Artificial intelligence is rapidly changing the way we work. Many people fear that machines will replace human workers and cause widespread unemployment. However, history suggests a more complex picture. When automation eliminates certain jobs, it often creates new ones that did not exist before. For example, the rise of the personal computer reduced the need for typists, but it generated entirely new fields such as software development and digital design. The key challenge, therefore, is not to resist technological change but to prepare workers for it through continuous education and retraining.`,
    questions: [
      {
        q: "이 글의 주제로 가장 적절한 것은?",
        options: [
          "AI가 모든 일자리를 없앨 것이다",
          "기술 변화에 대응하는 교육과 재훈련이 중요하다",
          "개인용 컴퓨터의 발명 과정",
          "타이피스트 직업의 역사"],
        answer: 1,
        exp: "마지막 문장에서 'prepare workers ~ through continuous education and retraining'을 핵심으로 제시한다.",
      },
      {
        q: "윗글의 내용과 일치하는 것은?",
        options: [
          "자동화는 새로운 일자리를 만들지 않는다",
          "PC의 등장으로 타이피스트 수요가 늘었다",
          "자동화가 직업을 없애는 동시에 새로운 직업을 만들기도 한다",
          "필자는 기술 변화에 저항해야 한다고 주장한다"],
        answer: 2,
        exp: "'it often creates new ones that did not exist before'와 일치한다.",
      },
    ],
  },
  {
    title: "지문 2 · 빈칸 추론",
    passage: `Reading regularly does more than expand your vocabulary. Studies show that people who read books frequently tend to have stronger empathy. By following the thoughts and emotions of fictional characters, readers learn to imagine perspectives different from their own. In this sense, literature is not merely entertainment; it is a kind of ______ that trains the mind to understand others.`,
    questions: [
      {
        q: "빈칸에 들어갈 말로 가장 적절한 것은?",
        options: ["exercise", "punishment", "obstacle", "secret"],
        answer: 0,
        exp: "마음을 훈련시키는 '운동/훈련(exercise)'이라는 비유가 문맥상 가장 자연스럽다.",
      },
      {
        q: "윗글에서 독서의 효과로 언급된 것은?",
        options: ["체력 향상", "공감 능력 강화", "수면의 질 개선", "기억력 감퇴"],
        answer: 1,
        exp: "'tend to have stronger empathy'에서 공감 능력 강화를 언급한다.",
      },
    ],
  },
  {
    title: "지문 3 · 환경",
    passage: `Plastic pollution has become one of the most serious environmental problems of our time. Every year, millions of tons of plastic waste end up in the oceans, where they harm marine life and eventually enter the human food chain. While recycling helps, it cannot solve the problem alone, because only a small fraction of plastic is actually recycled. Experts argue that the most effective solution is to reduce plastic production at the source and to develop biodegradable alternatives.`,
    questions: [
      {
        q: "필자가 가장 효과적이라고 보는 해결책은?",
        options: [
          "재활용률을 100%로 높이는 것",
          "플라스틱 생산 자체를 줄이고 생분해성 대체재를 개발하는 것",
          "바다를 청소하는 것",
          "해양 생물을 보호 구역으로 옮기는 것"],
        answer: 1,
        exp: "마지막 문장 'reduce plastic production at the source and to develop biodegradable alternatives'.",
      },
      {
        q: "윗글의 내용과 일치하지 않는 것은?",
        options: [
          "플라스틱 폐기물이 해양 생물에 해를 끼친다",
          "재활용만으로는 문제를 해결할 수 없다",
          "실제로 재활용되는 플라스틱은 일부에 불과하다",
          "플라스틱은 인간의 먹이사슬과 무관하다"],
        answer: 3,
        exp: "'eventually enter the human food chain'이라 했으므로 '무관하다'는 일치하지 않는다.",
      },
    ],
  },
  {
    title: "지문 4 · 글의 흐름 / 요지",
    passage: `Many students believe that studying for long hours is the secret to success. In reality, the quality of study matters far more than the quantity. Research on learning shows that short, focused sessions followed by brief breaks lead to better retention than marathon sessions. This is because the brain consolidates information during rest. Moreover, testing yourself on the material is far more effective than simply rereading it. In short, smart study habits, not sheer effort, determine how much we truly learn.`,
    questions: [
      {
        q: "이 글의 요지로 가장 적절한 것은?",
        options: [
          "공부는 무조건 오래 할수록 좋다",
          "휴식은 학습에 방해가 된다",
          "공부의 양보다 질, 즉 효율적인 학습 습관이 중요하다",
          "다시 읽기가 가장 효과적인 복습법이다"],
        answer: 2,
        exp: "'the quality of study matters far more than the quantity', 'smart study habits ~ determine how much we truly learn'.",
      },
      {
        q: "윗글에 따르면 더 효과적인 복습 방법은?",
        options: [
          "교재를 반복해서 읽기",
          "스스로 시험을 보며 점검하기",
          "쉬지 않고 오래 공부하기",
          "노트를 색깔별로 정리하기"],
        answer: 1,
        exp: "'testing yourself ~ is far more effective than simply rereading it'.",
      },
    ],
  },
];
