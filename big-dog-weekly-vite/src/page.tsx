import React, { useMemo, useState, useEffect } from 'react'
import { Calendar, Link as LinkIcon, BookOpen, CheckSquare, GraduationCap, Video, Megaphone, Printer, StickyNote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
interface WarmupItem { label: string; url: string }
interface Assignment { title: string; due?: string }
interface VideoItem { title: string; url: string }
interface Theme { primary: string; accent: string; paper: string }
interface Standard { code: string; text: string }
interface DayPlan { assignments: Assignment[]; notes: string }
interface WeekData {
  weekLabel: string;
  theme: Theme;
  standard: Standard;
  lessons: string[];
  assignments: Assignment[];
  announcements: string[];
  warmups: Record<DayKey, WarmupItem[]>;
  dayPlans: Record<DayKey, DayPlan>;
  videos: VideoItem[];
  logoText: string;
  logoUrl?: string;
  activeDays: DayKey[];
}

const WEEKDAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const shortWeekTemplates: Record<string, DayKey[]> = {
  'Full week (Mon–Fri)': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  'No Monday': ['Tue', 'Wed', 'Thu', 'Fri'],
  'No Friday': ['Mon', 'Tue', 'Wed', 'Thu'],
  'No Mon & Fri': ['Tue', 'Wed', 'Thu'],
  'Wed Only': ['Wed'],
}

const baseTheme: Theme = { primary: '#0b4da2', accent: '#15a1e6', paper: '#faf7f2' }
const blankDay: DayPlan = { assignments: [], notes: '' }

const coreLogo = 'https://drive.google.com/uc?id=1ckhsKopfwDLRiMmAetSP-zcUzzsUFZHj'
const accelLogo = 'https://drive.google.com/uc?id=XirbZmB2Rq2YNsTD2LZhBF'

const coreWeek: WeekData = {
  weekLabel: 'Week of Sep 22–26',
  theme: baseTheme,
  standard: {
    code: '6.NS.A.1',
    text: 'Interpret and compute quotients of fractions; solve word problems involving division of fractions by fractions.',
  },
  lessons: [
    'Dividing fractions with visual models',
    'Keep-Change-Flip strategy + error analysis',
    'Dividing mixed numbers; simplify answers',
    'Real-world word problems (3-Act Task)',
    'Weekly spiral review + quick check',
  ],
  assignments: [
    { title: 'Practice Set: Dividing Fractions #1', due: 'Wed' },
    { title: 'Word Problems Mini-Project (pairs)', due: 'Fri' },
  ],
  announcements: [
    'Bring charged Chromebooks daily.',
    'Quiz next Tuesday — notes allowed, no calculators.',
  ],
  warmups: {
    Mon: [{ label: 'Estimation 180 #23', url: 'https://example.com/estimation-23' }],
    Tue: [{ label: 'Which One Doesn’t Belong?', url: 'https://wodb.ca/' }],
    Wed: [{ label: 'Number Talk: 3/4 ÷ 1/2', url: '#' }],
    Thu: [{ label: 'Visual Pattern #112', url: 'https://www.visualpatterns.org/' }],
    Fri: [{ label: 'Friday Puzzle: Cross-Number #5', url: '#' }],
  },
  dayPlans: {
    Mon: { assignments: [{ title: 'Notebook Setup Check' }], notes: 'Emphasize model-first.' },
    Tue: { assignments: [{ title: 'Exit Ticket: KCF 3 items' }], notes: 'Error analysis pairs.' },
    Wed: { assignments: [], notes: '' },
    Thu: { assignments: [{ title: 'Word Problem Draft' }], notes: 'Vocabulary: divisor, quotient.' },
    Fri: { assignments: [{ title: 'Quick Check' }], notes: 'Celebrate effort shoutouts.' },
  },
  videos: [
    { title: 'Dividing Fractions — Visual Models', url: 'https://youtu.be/dQw4w9WgXcQ' },
    { title: 'Keep-Change-Flip in 90 Seconds', url: '#' },
  ],
  logoText: 'Big Dog Math 6',
  logoUrl: coreLogo,
  activeDays: [...WEEKDAYS],
}

const accelWeek: WeekData = {
  ...coreWeek,
  logoText: 'Big Dog Accelerated 6',
  logoUrl: accelLogo,
  standard: { code: '6.NS.A.1+ (Accelerated)', text: 'Extend division of fractions to mixed numbers; multi-step problems and error analysis.' },
  lessons: [
    'Fluency sprint: reciprocal reasoning',
    'Word problems — rate & ratio contexts',
    'Dividing mixed numbers — shortcuts & proofs',
    '3-Act Task (extension) + student write-ups',
    'Challenge set + reflection',
  ],
}

function upcomingDueDates(d: WeekData) {
  const fromWeekly = (d.assignments || []).map(a => ({ source: 'Weekly', ...a }))
  const fromDaily = WEEKDAYS.flatMap(day => (d.dayPlans?.[day]?.assignments || []).map(a => ({ source: day, ...a })))
  return [...fromWeekly, ...fromDaily].filter(x => !!x.due)
}

function Header({ data, setData }: { data: WeekData; setData: (u: WeekData) => void }) {
  const [logoBroken, setLogoBroken] = useState(false)

  const updateLogo = (url: string) => {
    setLogoBroken(false)
    setData({ ...data, logoUrl: url })
  }

  return (
    <div className="w-full border-b" style={{ borderColor: `${data.theme.primary}22`, background: `linear-gradient(135deg, ${data.theme.primary}, ${data.theme.accent})` }}>
      <div className="mx-auto max-w-6xl px-4 py-8 text-white">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-2xl p-4 shadow min-w-[4rem] min-h-[4rem] flex items-center justify-center">
              {data.logoUrl && !logoBroken ? (
                <img src={data.logoUrl} alt="Big Dog Logo" className="w-16 h-16 object-contain" onError={() => setLogoBroken(true)} />
              ) : (
                <div className="text-center">
                  <div className="text-xs">BIG DOG</div>
                  <div className="text-[10px] opacity-80">(add logo URL)</div>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{data.logoText}</h1>
              <p className="opacity-90 text-lg">Weekly Gameplan</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Calendar className="w-5 h-5" />
            <input className="rounded-xl px-3 py-2 text-black shadow" defaultValue={data.weekLabel} placeholder="Week label" onBlur={(e) => setData({ ...data, weekLabel: e.target.value })} />
            <input className="rounded-xl px-3 py-2 text-black shadow min-w-[18rem]" placeholder="Paste PUBLIC image URL for Big Dog logo" defaultValue={data.logoUrl || ''} onBlur={(e) => updateLogo(e.target.value)} />
            <Button onClick={() => window.print()} variant="secondary" className="bg-white/20 hover:bg-white/30 border border-white/30 text-white">
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
          </div>
        </div>
        <p className="mt-3 text-white/90">We think. We try. We don’t give up. We help each other. We celebrate effort.</p>
      </div>
    </div>
  )
}

function TopRow({ data }: { data: WeekData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
      <Card className="lg:col-span-1 rounded-2xl shadow-sm border-2" style={{ borderColor: `${data.theme.primary}33` }}>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5" style={{ color: data.theme.primary }} />
            <h2 className="text-lg font-bold">Standard</h2>
          </div>
          <div className="rounded-xl p-4" style={{ background: `${data.theme.primary}0D` }}>
            <p className="font-semibold" style={{ color: data.theme.primary }}>{data.standard.code}</p>
            <p className="mt-1 text-sm leading-6">{data.standard.text}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 rounded-2xl shadow-sm border-2" style={{ borderColor: `${data.theme.primary}33` }}>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5" style={{ color: data.theme.primary }} />
            <h2 className="text-lg font-bold">Lessons This Week</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.lessons.map((l, i) => (
              <li key={i} className="rounded-xl px-4 py-3 border" style={{ borderColor: `${data.theme.primary}22`, background: 'white' }}>
                <span className="text-sm">{l}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function WarmupsAndDayPlanner({ data, setData }: { data: WeekData; setData: (u: WeekData) => void }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <LinkIcon className="w-5 h-5" style={{ color: data.theme.primary }} />
        <h2 className="text-lg font-bold">Daily Warm-Ups & Day Planner</h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(shortWeekTemplates).map(([label, days]) => (
            <Button key={label} variant="secondary" onClick={() => setData({ ...data, activeDays: days })}>{label}</Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((d) => {
            const active = data.activeDays.includes(d)
            return (
              <Button
                key={d}
                variant={active ? 'default' : 'secondary'}
                className={active ? '' : 'opacity-60'}
                onClick={() => {
                  const next = active ? data.activeDays.filter(x => x !== d) : [...data.activeDays, d].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b))
                  setData({ ...data, activeDays: next })
                }}
              >
                {active ? `${d} ✓` : `${d} •`}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {data.activeDays.map((d) => (
          <Card key={d} className="rounded-2xl shadow-sm border-2" style={{ borderColor: `${data.theme.primary}33` }}>
            <CardContent className="p-4 space-y-3">
              <div className="font-semibold" style={{ color: data.theme.primary }}>{d}</div>

              <div>
                <div className="text-xs font-semibold mb-1">Warm‑Up</div>
                <ul>
                  {(data.warmups[d] || []).slice(0, 1).map((w, i) => (
                    <li key={i}><a href={w.url} className="underline text-sm break-words" target="_blank" rel="noreferrer">{w.label}</a></li>
                  ))}
                  {(data.warmups[d] || []).length === 0 && <li className="text-xs opacity-60">No warm‑up set</li>}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold mb-1">Assignment Options</div>
                <ul className="space-y-1">
                  {(data.dayPlans[d]?.assignments || []).map((a, i) => (
                    <li key={i} className="rounded-lg px-3 py-2 border bg-white text-sm" style={{ borderColor: `${data.theme.primary}22` }}>
                      {a.title}{a.due ? <span className="text-xs ml-2" style={{ color: data.theme.primary }}>(Due {a.due})</span> : null}
                    </li>
                  ))}
                  {(data.dayPlans[d]?.assignments || []).length === 0 && (
                    <li className="text-xs opacity-60">No day-specific assignments</li>
                  )}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold mb-1 flex items-center gap-1"><StickyNote className="w-3 h-3" /> Notes</div>
                <textarea
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="Notes, reminders, accommodations..."
                  defaultValue={data.dayPlans[d]?.notes || ''}
                  onBlur={(e) => setData({ ...data, dayPlans: { ...data.dayPlans, [d]: { ...(data.dayPlans[d] || blankDay), notes: e.target.value } } })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function BottomRow({ data }: { data: WeekData }) {
  const upcoming = useMemo(() => upcomingDueDates(data), [data])
  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 print:grid-cols-4">
      <Card className="rounded-2xl shadow-sm border-2" style={{ borderColor: `${data.theme.primary}33` }}>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-5 h-5" style={{ color: data.theme.primary }} />
            <h2 className="text-lg font-bold">Assignments (Weekly)</h2>
          </div>
          <ul className="space-y-2">
            {data.assignments.map((a, i) => (
              <li key={i} className="flex items-center justify-between rounded-xl border px-4 py-3 bg-white" style={{ borderColor: `${data.theme.primary}22` }}>
                <span className="text-sm">{a.title}</span>
                {a.due && <span className="text-xs font-semibold" style={{ color: data.theme.primary }}>Due {a.due}</span>}
              </li>
            ))}
            {data.assignments.length === 0 && <li className="text-xs opacity-60">No weekly assignments listed</li>}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-2" style={{ borderColor: `${data.theme.primary}33` }}>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Video className="w-5 h-5" style={{ color: data.theme.primary }} />
            <h2 className="text-lg font-bold">Helpful Videos</h2>
          </div>
          <ul className="space-y-2">
            {data.videos.map((v, i) => (
              <li key={i} className="rounded-xl px-4 py-3 border bg-white" style={{ borderColor: `${data.theme.primary}22` }}>
                <a href={v.url} className="underline text-sm break-words" target="_blank" rel="noreferrer">{v.title}</a>
              </li>
            ))}
            {data.videos.length === 0 && <li className="text-xs opacity-60">No videos linked yet</li>}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-2" style={{ borderColor: `${data.theme.primary}33` }}>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5" style={{ color: data.theme.primary }} />
            <h2 className="text-lg font-bold">Announcements</h2>
          </div>
          <ul className="space-y-2">
            {data.announcements.map((n, i) => (
              <li key={i} className="rounded-xl px-4 py-3 border bg-white text-sm" style={{ borderColor: `${data.theme.primary}22` }}>{n}</li>
            ))}
            {data.announcements.length === 0 && <li className="text-xs opacity-60">No announcements this week</li>}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-2" style={{ borderColor: `${data.theme.primary}33` }}>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-5 h-5" style={{ color: data.theme.primary }} />
            <h2 className="text-lg font-bold">Upcoming Due Dates</h2>
          </div>
          <ul className="space-y-2">
            {upcoming.map((a, i) => (
              <li key={i} className="rounded-xl px-4 py-3 border bg-white text-sm" style={{ borderColor: `${data.theme.primary}22` }}>
                {(a as any).source === 'Weekly' ? '(Weekly) ' : `(${(a as any).source}) `}{a.title} — <span className="font-semibold">Due {a.due}</span>
              </li>
            ))}
            {upcoming.length === 0 && <li className="text-xs opacity-60">No due dates listed</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function runDevChecks() {
  const isHex6 = (s: string) => /^#([0-9a-fA-F]{6})$/.test(s || '')
  const dataSets = [coreWeek, accelWeek]
  console.groupCollapsed('BigDogWeeklyPage self-tests')
  for (const d of dataSets) {
    console[isHex6(d.theme.primary) ? 'log' : 'error']('theme.primary hex ok for', d.logoText)
    const warmupsOk = WEEKDAYS.every(day => (d.warmups[day] || []).length <= 1)
    console[warmupsOk ? 'log' : 'error']('<=1 warm-up/day for', d.logoText)
    const activeOk = d.activeDays.every(x => WEEKDAYS.includes(x))
    console[activeOk ? 'log' : 'error']('activeDays subset for', d.logoText)
    const vidsOk = d.videos.every(v => v.title && typeof v.url === 'string')
    console[vidsOk ? 'log' : 'error']('videos well-formed for', d.logoText)
    const dueExpected = (d.assignments.filter(a => !!a.due).length) +
      WEEKDAYS.reduce((acc, day) => acc + (d.dayPlans[day]?.assignments || []).filter(a => !!a.due).length, 0)
    const upcoming = upcomingDueDates(d).length
    console[upcoming === dueExpected ? 'log' : 'error'](`upcoming due count matches (${upcoming}/${dueExpected}) for`, d.logoText)
  }
  console.groupEnd()
}

function Page({ initial }: { initial: WeekData }) {
  const [data, setData] = useState<WeekData>(initial)
  useEffect(() => { runDevChecks() }, [])

  return (
    <div className="min-h-screen w-full" style={{ background: data.theme.paper }}>
      <Header data={data} setData={setData} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <TopRow data={data} />
        <WarmupsAndDayPlanner data={data} setData={setData} />
        <BottomRow data={data} />
        <ThemeTweaks data={data} setData={setData} />
      </main>
      <style>{`
        @media print {
          input, button, textarea, select { display: none !important; }
          a { text-decoration: none; }
        }
      `}</style>
    </div>
  )
}

function ThemeTweaks({ data, setData }: { data: WeekData; setData: (u: WeekData) => void }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="text-sm opacity-70">Big Dog style tune‑up:</span>
      <label className="text-sm">Primary
        <input type="color" className="ml-2 align-middle" value={data.theme.primary} onChange={(e)=> setData({...data, theme: {...data.theme, primary: e.target.value }})} />
      </label>
      <label className="text-sm">Accent
        <input type="color" className="ml-2 align-middle" value={data.theme.accent} onChange={(e)=> setData({...data, theme: {...data.theme, accent: e.target.value }})} />
      </label>
      <label className="text-sm">Paper
        <input type="color" className="ml-2 align-middle" value={data.theme.paper} onChange={(e)=> setData({...data, theme: {...data.theme, paper: e.target.value }})} />
      </label>
    </div>
  )
}

export default function BigDogWeeklyPage() {
  const [tab, setTab] = useState<'core' | 'accel'>('core')
  const active = useMemo(() => (tab === 'core' ? coreWeek : accelWeek), [tab])

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex gap-2">
          <Button onClick={() => setTab('core')} variant={tab === 'core' ? 'default' : 'secondary'}>Math 6</Button>
          <Button onClick={() => setTab('accel')} variant={tab === 'accel' ? 'default' : 'secondary'}>Accelerated</Button>
        </div>
      </div>
      <Page initial={active} />
    </div>
  )
}
