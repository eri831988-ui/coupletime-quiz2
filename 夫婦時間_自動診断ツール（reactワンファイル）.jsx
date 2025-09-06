import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronLeft, ChevronRight, Heart, RefreshCw } from "lucide-react";

// ===== 設定：質問10問 =====
// 選択肢は A/B/C/D = 会話派/体験派/癒し派/アクティブ派 に対応
const QUESTIONS = [
  {
    id: 1,
    text: "最近の夫婦の雰囲気は？",
    options: [
      { key: "A", label: "会話が少なく気まずい" },
      { key: "B", label: "仲はいいけど盛り上がらない" },
      { key: "C", label: "忙しくてほぼ時間が取れない" },
      { key: "D", label: "仲良いけどマンネリ気味" },
    ],
  },
  {
    id: 2,
    text: "夫婦時間に求めるものは？",
    options: [
      { key: "A", label: "会話したい" },
      { key: "B", label: "一緒に楽しみたい" },
      { key: "C", label: "癒しやリラックス" },
      { key: "D", label: "外出して気分転換" },
    ],
  },
  {
    id: 3,
    text: "相手のタイプに近いのは？",
    options: [
      { key: "A", label: "無口であまり話さない" },
      { key: "B", label: "ノリはいいけどすぐ飽きる" },
      { key: "C", label: "まったり系でのんびりしたい" },
      { key: "D", label: "行動派で外に出たい" },
    ],
  },
  {
    id: 4,
    text: "夫婦時間の理想は？",
    options: [
      { key: "A", label: "短時間でいいから毎日続けたい" },
      { key: "B", label: "休日にまとまった時間を過ごしたい" },
      { key: "C", label: "特別なイベントを楽しみたい" },
      { key: "D", label: "思いついた時に気軽にやりたい" },
    ],
  },
  {
    id: 5,
    text: "もし理想の夫婦時間が叶ったら？",
    options: [
      { key: "A", label: "今より気楽に話せそう" },
      { key: "B", label: "一緒に笑える時間が増えそう" },
      { key: "C", label: "落ち着いて安心できそう" },
      { key: "D", label: "新鮮でドキドキしそう" },
    ],
  },
  {
    id: 6,
    text: "休日の過ごし方は？",
    options: [
      { key: "A", label: "家でまったりするのが好き" },
      { key: "B", label: "ちょっとした作業や遊びをしたい" },
      { key: "C", label: "昼寝やリラックスを大事にしたい" },
      { key: "D", label: "外に出かけて気分を変えたい" },
    ],
  },
  {
    id: 7,
    text: "会話のスタイルは？",
    options: [
      { key: "A", label: "ゆっくりじっくり話したい" },
      { key: "B", label: "ふざけ合ったり盛り上がりたい" },
      { key: "C", label: "会話少なめで穏やかに過ごしたい" },
      { key: "D", label: "会話より行動・体験重視" },
    ],
  },
  {
    id: 8,
    text: "一緒にやってみたいことは？",
    options: [
      { key: "A", label: "お互いのことをもっと知るような話" },
      { key: "B", label: "ゲームや料理など共通体験" },
      { key: "C", label: "リラックスできる習慣" },
      { key: "D", label: "旅行や新しい場所探検" },
    ],
  },
  {
    id: 9,
    text: "夫婦時間の長さの理想は？",
    options: [
      { key: "A", label: "10分くらいでOK" },
      { key: "B", label: "30分〜1時間しっかり" },
      { key: "C", label: "気分次第でゆるく長め" },
      { key: "D", label: "半日〜1日がっつり" },
    ],
  },
  {
    id: 10,
    text: "今いちばん欲しいのは？",
    options: [
      { key: "A", label: "安心して話せる空気" },
      { key: "B", label: "笑い合える楽しい時間" },
      { key: "C", label: "一緒に癒される落ち着き" },
      { key: "D", label: "新鮮な刺激や冒険感" },
    ],
  },
] as const;

// ===== 結果テンプレ（各タイプ10個・ユーザー指定の最終版） =====
const RESULT_MAP: Record<"A" | "B" | "C" | "D", { title: string; subtitle: string; items: string[] }> = {
  A: {
    title: "🌸 タイプA：会話派",
    subtitle: "とにかく自然に話がしたい！人向け",
    items: [
      "今日のハイライトを1つずつ話す",
      "相手の趣味について教えてもらう",
      "昔の写真を見て思い出話",
      "『もし◯◯だったら？』妄想トーク",
      "今度やりたいことリストを一緒に書く",
      "子どもの頃の話を聞き合う",
      "週末に『1週間の振り返りトーク』",
      "ニュースや本を読んで感想を話す",
      "お互いの『今日の学び』をシェア",
      "未来の旅行プランを語り合う",
    ],
  },
  B: {
    title: "🎲 タイプB：体験派",
    subtitle: "一緒に何かやって盛り上がりたい！人向け",
    items: [
      "一緒に料理して晩酌",
      "短時間のボードゲーム（UNOなど）",
      "パズルやレゴを一緒に作る",
      "DIYや模様替えを一緒にする",
      "YouTubeの筋トレを一緒にやる",
      "TikTokの簡単ダンスに挑戦",
      "新しいお菓子やお酒を一緒に試す",
      "簡単なお菓子作り",
      "一緒に朝活（散歩・カフェ・勉強）",
      "シリーズもののドラマを一緒に観る",
    ],
  },
  C: {
    title: "☁️ タイプC：癒し派",
    subtitle: "とにかく一緒にリラックスしたい！人向け",
    items: [
      "一緒にヨガ",
      "お風呂に一緒に入る（抵抗なければ）",
      "部屋を暗くしてキャンドルやアロマタイム",
      "ハンドマッサージし合う",
      "一緒に瞑想",
      "猫カフェに行く",
      "星を眺めながらおしゃべり",
      "庭やベランダで日向ぼっこ",
      "お互いに『頑張ってるなー』って思うことを伝える",
      "ペアストレッチに挑戦",
    ],
  },
  D: {
    title: "🚗 タイプD：アクティブ派",
    subtitle: "外に出て新鮮な時間を楽しみたい！人向け",
    items: [
      "ドライブに行く",
      "季節イベント（花火・紅葉・桜）に行く",
      "まだ行ったことのないスーパーへ行って冒険気分",
      "新しいカフェでモーニング",
      "美術館や博物館を巡る",
      "夜のお散歩デート",
      "ピクニックランチ",
      "サイクリング",
      "スーパーで『今夜のごはんを一緒に決める』",
      "映画館で映画鑑賞",
    ],
  },
};

// ===== UIコンポーネント =====
export default function CoupleTimeQuiz() {
  const [step, setStep] = useState<number>(0); // 0 = スタート, 1..10 = 質問, 11 = 結果
  const [answers, setAnswers] = useState<("A" | "B" | "C" | "D")[]>(Array(QUESTIONS.length).fill(null));

  const progress = useMemo(() => (step === 0 ? 0 : (step / QUESTIONS.length) * 100), [step]);

  const scores = useMemo(() => {
    const base = { A: 0, B: 0, C: 0, D: 0 } as Record<"A" | "B" | "C" | "D", number>;
    answers.forEach((k) => {
      if (k) base[k] += 1;
    });
    return base;
  }, [answers]);

  const topKeys = useMemo(() => {
    const max = Math.max(...Object.values(scores));
    if (max === 0) return [];
    return (Object.keys(scores) as ("A" | "B" | "C" | "D")[]).filter((k) => scores[k] === max);
  }, [scores]);

  const start = () => setStep(1);
  const reset = () => {
    setStep(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
  };

  const selectOption = (qIndex: number, key: "A" | "B" | "C" | "D") => {
    const next = [...answers];
    next[qIndex] = key;
    setAnswers(next);
    // 自動で次へ
    if (step < QUESTIONS.length) setStep(step + 1);
  };

  const goPrev = () => setStep((s) => Math.max(1, s - 1));
  const goNext = () => setStep((s) => Math.min(QUESTIONS.length, s + 1));
  const showResult = () => setStep(QUESTIONS.length + 1);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 to-white flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl shadow-xl border-0 rounded-2xl">
        <CardContent className="p-6 md:p-10">
          {/* ヘッダー */}
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-7 h-7 text-rose-500" />
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">夫婦時間 診断ツール</h1>
          </div>

          {/* スタート画面 */}
          {step === 0 && (
            <div className="space-y-6">
              <p className="text-muted-foreground">ボタンを押して10問に答えると、あなたに合った「夫婦時間タイプ」と具体的な過ごし方（10個）が表示されます。</p>
              <Button size="lg" className="rounded-2xl" onClick={start}>
                診断をはじめる
              </Button>
            </div>
          )}

          {/* 質問画面 */}
          {step > 0 && step <= QUESTIONS.length && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Q{step} / {QUESTIONS.length}</span>
                <span>進捗 {Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />

              <div className="mt-2">
                <h2 className="text-xl md:text-2xl font-medium mb-4">{QUESTIONS[step - 1].text}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {QUESTIONS[step - 1].options.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => selectOption(step - 1, opt.key)}
                      className={`w-full text-left p-4 rounded-2xl border transition hover:shadow-md focus:outline-none ${
                        answers[step - 1] === opt.key ? "border-rose-500 bg-rose-50" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {answers[step - 1] === opt.key ? (
                          <Check className="w-5 h-5 text-rose-500" />
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs">{opt.key}</span>
                        )}
                        <span className="text-base">{opt.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" className="rounded-2xl" onClick={goPrev} disabled={step === 1}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> 戻る
                </Button>
                {step < QUESTIONS.length ? (
                  <Button className="rounded-2xl" onClick={goNext} disabled={!answers[step - 1]}>
                    次へ <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button className="rounded-2xl" onClick={showResult} disabled={answers.includes(null as any)}>
                    診断結果を見る
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* 結果画面 */}
          {step === QUESTIONS.length + 1 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold">診断結果</h2>
                  <p className="text-muted-foreground mt-1 text-sm">最もスコアが高いタイプを表示しています。タイがある場合は該当タイプをすべて表示します。</p>
                </div>
                <Button variant="ghost" onClick={reset} className="rounded-2xl">
                  <RefreshCw className="w-4 h-4 mr-2" /> もう一度
                </Button>
              </div>

              <div className="grid gap-6">
                {topKeys.length === 0 && (
                  <p className="text-muted-foreground">回答が不足しています。最初からやり直してください。</p>
                )}

                {topKeys.map((k) => (
                  <div key={k} className="p-5 rounded-2xl border bg-white">
                    <div className="mb-3">
                      <h3 className="text-xl font-semibold">{RESULT_MAP[k].title}</h3>
                      <p className="text-sm text-muted-foreground">{RESULT_MAP[k].subtitle}</p>
                    </div>
                    <ul className="list-disc pl-6 space-y-2">
                      {RESULT_MAP[k].items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100">
                  <p className="text-sm">
                    もっと具体的に落とし込みたい人は、
                    <span className="font-medium">「うちの状況で何から始めればいい？」</span>
                    とメッセージください。あなた専用の一歩を一緒に作ります。
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
