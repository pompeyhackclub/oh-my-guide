import { useMemo, useState } from 'react'
import TaskCard from '../components/TaskCard.jsx'
import { CATEGORIES } from '../data/tasks.js'
import { distanceMeters } from '../utils/distance.js'

const FILTERS = [
	{ id: 'all', label: 'All' },
	{ id: 'todo', label: 'To do' },
	{ id: 'done', label: 'Done' },
]

export default function ChecklistScreen({ tasks, completed, userPosition, onOpen }) {
	const [filter, setFilter] = useState('all')
	const [category, setCategory] = useState('All')
	const [query, setQuery] = useState('')
	const [sortByDistance, setSortByDistance] = useState(false)

	const visible = useMemo(() => {
		const q = query.trim().toLowerCase()
		let list = tasks.filter(t => {
			if (category !== 'All' && t.category !== category) return false
			if (filter === 'todo' && completed[t.id]) return false
			if (filter === 'done' && !completed[t.id]) return false
			if (q && !`${t.title} ${t.hint}`.toLowerCase().includes(q)) return false
			return true
		})
		if (sortByDistance && userPosition) {
			list = [...list].sort(
				(a, b) => distanceMeters(userPosition, a) - distanceMeters(userPosition, b)
			)
		}
		return list
	}, [tasks, completed, filter, category, query, sortByDistance, userPosition])

	return (
		<div className="screen checklist-screen">
			<header className="screen-header">
				{/* <span className="eyebrow">Master list</span> */}
				<h2>All activities</h2>
				<p className="screen-sub">Filter, search and tap a card to dive into the story.</p>
			</header>

			<div className="checklist-controls">
				<input
					type="search"
					placeholder="Search activities…"
					value={query}
					onChange={e => setQuery(e.target.value)}
					className="search-input"
					aria-label="Search tasks"
				/>
				<div className="chip-row">
					{FILTERS.map(f => (
						<button
							key={f.id}
							type="button"
							className={`pill ${filter === f.id ? 'pill-active' : ''}`}
							onClick={() => setFilter(f.id)}
						>
							{f.label}
						</button>
					))}
				</div>
				<div className="chip-row chip-row-wrap">
					<button
						type="button"
						className={`pill ${category === 'All' ? 'pill-active' : ''}`}
						onClick={() => setCategory('All')}
					>
						All
					</button>
					{CATEGORIES.map(c => (
						<button
							key={c}
							type="button"
							className={`pill ${category === c ? 'pill-active' : ''}`}
							onClick={() => setCategory(c)}
						>
							{c}
						</button>
					))}
				</div>
				<label className="distance-toggle">
					<input
						type="checkbox"
						checked={sortByDistance}
						onChange={e => setSortByDistance(e.target.checked)}
					/>
					<span>
						Nearest first
						{sortByDistance && !userPosition && (
							<span className="distance-toggle-hint"> · waiting for GPS…</span>
						)}
					</span>
				</label>
			</div>

			<div className="checklist-grid">
				{visible.length === 0 && (
					<div className="empty-card">Nothing matches those filters yet.</div>
				)}
				{visible.map(task => (
					<TaskCard
						key={task.id}
						task={task}
						done={Boolean(completed[task.id])}
						allTasks={tasks}
						completed={completed}
						userPosition={userPosition}
						onOpen={onOpen}
						variant="row"
					/>
				))}
			</div>
		</div>
	)
}
