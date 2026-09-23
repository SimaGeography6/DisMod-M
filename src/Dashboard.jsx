import React, { useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import {
  Globe, Calendar, MapPin, Activity, Search, TrendingUp, Users, Database
} from 'lucide-react'
import rawData from './data/studies.json'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899', '#64748b']
const HEALTH_TYPE_COLORS = {
  'COVID-19': '#ef4444',
  'COVID': '#f87171',
  'INFECTIOUS DISEASES': '#22c55e',
  'CANCERS': '#3b82f6',
  'LIFE STYLE DISEASES': '#f59e0b',
  'PSYCHOMOTOR': '#a855f7',
  'DEGENERATIVE DISEASES': '#14b8a6',
  'NA': '#94a3b8'
}

const pct = (part, total, digits = 1) => total > 0 ? `${((part / total) * 100).toFixed(digits)}%` : '0%'
const safeChartData = (data, label = 'No matching data') =>
  data.length ? data : [{ name: label, value: 0 }]

function EmptyChart({ message = 'No data matches the current filters.' }) {
  return (
    <div className="h-[300px] flex items-center justify-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-sm text-slate-500 px-4 text-center">
      {message}
    </div>
  )
}

function SectionTitle({ children, icon = 'from-blue-500 to-purple-500' }) {
  return (
    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 flex items-center">
      <span className={`w-1.5 h-7 bg-gradient-to-b ${icon} rounded-full mr-3 shrink-0`} />
      {children}
    </h3>
  )
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHealthType, setSelectedHealthType] = useState('All')
  const [selectedContinent, setSelectedContinent] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const [viewMode, setViewMode] = useState('overview')

  const filteredData = useMemo(() => rawData.filter(item => {
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch = !q ||
      [item.author, item.country, item.condition, item.insight, item.province]
        .some(v => String(v).toLowerCase().includes(q))
    return matchesSearch &&
      (selectedHealthType === 'All' || item.healthType === selectedHealthType) &&
      (selectedContinent === 'All' || item.continent === selectedContinent) &&
      (selectedYear === 'All' || String(item.year) === selectedYear)
  }), [searchTerm, selectedHealthType, selectedContinent, selectedYear])

  const healthTypeData = useMemo(() => {
    const counts = {}
    filteredData.forEach(i => { counts[i.healthType] = (counts[i.healthType] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [filteredData])

  const continentData = useMemo(() => {
    const counts = {}
    filteredData.forEach(i => { counts[i.continent] = (counts[i.continent] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [filteredData])

  const yearlyTrends = useMemo(() => {
    const counts = {}
    filteredData.forEach(i => { counts[i.year] = (counts[i.year] || 0) + 1 })
    return Object.entries(counts).map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => a.year - b.year)
  }, [filteredData])

  const topConditions = useMemo(() => {
    const counts = {}
    filteredData.forEach(i => { counts[i.condition] = (counts[i.condition] || 0) + 1 })
    return Object.entries(counts).map(([condition, count]) => ({ condition, count }))
      .sort((a, b) => b.count - a.count).slice(0, 10)
  }, [filteredData])

  const researchHotspots = useMemo(() => {
    const counts = {}
    filteredData.forEach(i => {
      if (i.country !== 'Global') counts[i.country] = (counts[i.country] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([country, count]) => ({ country, count }))
  }, [filteredData])

  const covidCount = filteredData.filter(i => i.healthType === 'COVID-19' || i.healthType === 'COVID').length
  const covidVsOthersData = [
    { name: 'COVID-19 Related', value: covidCount, color: '#ef4444' },
    { name: 'Other Diseases', value: filteredData.length - covidCount, color: '#22a06b' }
  ]

  const environmentalCount = filteredData.filter(i => {
    const s = i.insight.toLowerCase()
    return ['environmental', 'climate', 'pollution', 'air quality', 'temperature', 'humidity'].some(k => s.includes(k))
  }).length
  const environmentalImpactData = [
    { name: 'Environmental Factors', value: environmentalCount, color: '#22c55e' },
    { name: 'Non-Environmental', value: filteredData.length - environmentalCount, color: '#f59e0b' }
  ]

  const recentTrendsData = yearlyTrends.filter(i => i.year >= 2020)

  const multiAuthorStudies = filteredData.filter(i => i.author.toLowerCase().includes('et al') || i.author.includes('&')).length
  const collaborationNetwork = [
    { name: 'Collaborative Research', value: multiAuthorStudies, color: '#3b82f6' },
    { name: 'Individual Research', value: filteredData.length - multiAuthorStudies, color: '#f59e0b' }
  ]

  const uniqueHealthTypes = [...new Set(rawData.map(i => i.healthType))]
  const uniqueContinents = [...new Set(rawData.map(i => i.continent))]
  const uniqueYears = [...new Set(rawData.map(i => i.year))].sort((a, b) => b - a)
  const reset = () => {
    setSearchTerm('')
    setSelectedHealthType('All')
    setSelectedContinent('All')
    setSelectedYear('All')
  }

  const yearsRange = filteredData.length
    ? Math.max(...filteredData.map(d => d.year)) - Math.min(...filteredData.map(d => d.year)) + 1
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-5 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-2xl sm:rounded-3xl shadow-xl mb-6 sm:mb-8 p-4 sm:p-6 lg:p-8 border border-slate-100">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              <div className="shrink-0">
                <div className="flex items-center">
                  <div className="bg-slate-800 text-white font-bold text-lg px-2.5 py-1.5 rounded-l-xl">SD</div>
                  <div className="bg-slate-800 text-white font-bold text-[9px] px-2 py-1 rounded-r-xl -ml-1 leading-tight">
                    <div>SURAJIT</div><div>DEBNATH</div>
                  </div>
                </div>
                <div className="bg-slate-800 text-white font-bold text-xs px-2.5 py-1 rounded-lg mt-1 text-center leading-tight">
                  <div>ANALYTICS</div><div>LAB</div>
                </div>
              </div>
              <div className="p-2.5 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shrink-0">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Spatial Diseases Modeling Dashboard
                </h1>
                <p className="text-slate-600 mt-1.5 text-sm sm:text-base">Interactive analysis of Google Earth-based disease research</p>
              </div>
            </div>
            <div className="xl:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-slate-800">{filteredData.length}</div>
              <div className="text-sm text-slate-600">Research Studies</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 bg-slate-100 rounded-xl sm:rounded-2xl p-1 mt-6">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'detailed', label: 'Detailed Analysis', icon: TrendingUp },
              { id: 'insights', label: 'Research Insights', icon: Activity }
            ].map(tab => (
              <button key={tab.id} onClick={() => setViewMode(tab.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-xl transition-all ${
                  viewMode === tab.id ? 'bg-white shadow text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}>
                <tab.icon className="w-4 h-4" /><span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mt-5">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input type="search" placeholder="Search studies..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <select value={selectedHealthType} onChange={e => setSelectedHealthType(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="All">All Health Types</option>
              {uniqueHealthTypes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value={selectedContinent} onChange={e => setSelectedContinent(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="All">All Continents</option>
              {uniqueContinents.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="All">All Years</option>
              {uniqueYears.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <button onClick={reset}
              className="sm:col-span-2 lg:col-span-1 px-4 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition">
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-5">
            {[
              ['Total Studies', filteredData.length, Activity, 'from-blue-500 to-blue-600'],
              ['Countries', new Set(filteredData.map(d => d.country)).size, MapPin, 'from-green-500 to-green-600'],
              ['Health Types', new Set(filteredData.map(d => d.healthType)).size, Users, 'from-purple-500 to-purple-600'],
              ['Year Range', yearsRange, Calendar, 'from-orange-500 to-orange-600']
            ].map(([label, value, Icon, gradient]) => (
              <div key={label} className={`bg-gradient-to-r ${gradient} p-4 rounded-2xl text-white`}>
                <div className="flex items-center justify-between gap-2">
                  <div><div className="text-xl sm:text-2xl font-bold">{value}</div><div className="text-white/80 text-sm">{label}</div></div>
                  <Icon className="w-7 h-7 text-white/60 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </header>

        {viewMode === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-5 sm:mb-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
                <SectionTitle>Health Condition Types</SectionTitle>
                {healthTypeData.length ? <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={healthTypeData} cx="50%" cy="50%" outerRadius="68%" dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                      {healthTypeData.map((entry, i) => <Cell key={entry.name} fill={HEALTH_TYPE_COLORS[entry.name] || COLORS[i % COLORS.length]} />)}
                    </Pie><Tooltip />
                  </PieChart>
                </ResponsiveContainer> : <EmptyChart />}
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
                <SectionTitle icon="from-green-500 to-blue-500">Geographic Distribution</SectionTitle>
                {continentData.length ? <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={continentData} margin={{ bottom: 35, left: 5, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} interval={0} tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#6366f1" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer> : <EmptyChart />}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-5 sm:mb-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
                <SectionTitle icon="from-purple-500 to-pink-500">Research Trends Over Time</SectionTitle>
                {yearlyTrends.length ? <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={yearlyTrends} margin={{ left: 5, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis allowDecimals={false} />
                    <Tooltip /><Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer> : <EmptyChart />}
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
                <SectionTitle icon="from-red-500 to-orange-500">Most Studied Conditions</SectionTitle>
                {topConditions.length ? <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={topConditions} layout="vertical" margin={{ left: 5, right: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="condition" type="category" width={105} tick={{ fontSize: 10 }} />
                    <Tooltip /><Bar dataKey="count" fill="#22c55e" radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer> : <EmptyChart />}
              </div>
            </div>
          </>
        )}

        {viewMode === 'detailed' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-5 sm:mb-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
                <SectionTitle icon="from-orange-500 to-red-500">Research Hotspots by Country</SectionTitle>
                {researchHotspots.length ? <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={researchHotspots} margin={{ bottom: 55, left: 5, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="country" angle={-35} textAnchor="end" height={85} interval={0} tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#f97316" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer> : <EmptyChart />}
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
                <SectionTitle icon="from-red-500 to-pink-500">COVID-19 vs Other Diseases</SectionTitle>
                {filteredData.length ? <ResponsiveContainer width="100%" height={320}>
                  <PieChart><Pie data={covidVsOthersData} cx="50%" cy="50%" outerRadius="68%" dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                    {covidVsOthersData.map(e => <Cell key={e.name} fill={e.color} />)}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer> : <EmptyChart />}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-5 sm:mb-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
                <SectionTitle icon="from-green-500 to-teal-500">Environmental Factor Studies</SectionTitle>
                {filteredData.length ? <ResponsiveContainer width="100%" height={320}>
                  <PieChart><Pie data={environmentalImpactData} cx="50%" cy="50%" outerRadius="68%" dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                    {environmentalImpactData.map(e => <Cell key={e.name} fill={e.color} />)}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer> : <EmptyChart />}
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
                <SectionTitle icon="from-indigo-500 to-purple-500">Recent Research Surge (2020+)</SectionTitle>
                {recentTrendsData.length ? <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={recentTrendsData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis allowDecimals={false} /><Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} /></BarChart>
                </ResponsiveContainer> : <EmptyChart message="No 2020+ studies match the current filters." />}
              </div>
            </div>
          </>
        )}

        {viewMode === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-5 sm:mb-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
              <SectionTitle icon="from-blue-500 to-indigo-500">Research Collaboration Patterns</SectionTitle>
              {filteredData.length ? <ResponsiveContainer width="100%" height={320}>
                <PieChart><Pie data={collaborationNetwork} cx="50%" cy="50%" outerRadius="68%" dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                  {collaborationNetwork.map(e => <Cell key={e.name} fill={e.color} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer> : <EmptyChart />}
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-purple-100">
              <SectionTitle icon="from-purple-500 to-indigo-500">Key Research Insights</SectionTitle>
              <div className="space-y-3">
                {[
                  ['🦠 Pandemic Impact', `${pct(covidCount, filteredData.length)} of the filtered studies are classified as COVID-19/COVID.`],
                  ['🌍 Environmental Focus', `${pct(environmentalCount, filteredData.length)} match the dashboard's environmental keyword rule.`],
                  ['🤝 Collaboration Trends', `${pct(multiAuthorStudies, filteredData.length)} use an author field containing “et al” or “&”.`],
                  ['📈 Research Growth', `${recentTrendsData.reduce((s, i) => s + i.count, 0)} filtered studies are dated 2020 or later.`]
                ].map(([title, body]) => <div key={title} className="bg-white p-4 rounded-xl border border-slate-100">
                  <h4 className="font-semibold text-slate-800 mb-1">{title}</h4><p className="text-slate-600 text-sm">{body}</p>
                </div>)}
              </div>
            </div>
          </div>
        )}

        <section className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6">
          <SectionTitle icon="from-indigo-500 to-blue-500">Research Studies Details</SectionTitle>
          {filteredData.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No studies match the current filters. Try clearing the filters.</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full min-w-[900px] table-auto">
                  <thead><tr className="bg-slate-50">
                    {['Author','Year','Country','Continent','Health Type','Condition','Key Insight'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>)}
                  </tr></thead>
                  <tbody>{filteredData.slice(0, 20).map((item, index) => (
                    <tr key={item.id} className={index % 2 ? 'bg-slate-50/60' : 'bg-white'}>
                      <td className="px-4 py-3 text-sm text-slate-900">{item.author}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{item.year}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{item.country}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{item.continent}</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{item.healthType}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700">{item.condition}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 max-w-sm">{item.insight}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              {filteredData.length > 20 && <p className="mt-4 text-center text-sm text-slate-500">Showing first 20 of {filteredData.length} results. Use filters to narrow down the data.</p>}
            </>
          )}
        </section>

        <footer className="mt-6 sm:mt-8 bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg"><Database className="w-5 h-5" /> SDN Analytics Lab</div>
              <p className="text-slate-400 text-sm mt-1">Spatial data • disease modeling • evidence-oriented analytics</p>
            </div>
            <div className="text-sm text-slate-400 md:text-right">
              <div>Spatial Diseases Modeling Dashboard</div>
              <div className="mt-1">Dataset: 74 studies supplied for this dashboard</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Dashboard
