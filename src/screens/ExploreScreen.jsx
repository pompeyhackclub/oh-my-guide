import { useMemo } from 'react'
import TaskCard from '../components/TaskCard.jsx'
import { distanceMeters, formatDistance } from '../utils/distance.js'

export default function ExploreScreen({ tasks, completed, userPosition, geoStatus, onOpen }) {
	const sorted = useMemo(() => {
		if (!userPosition) {
			// Without geo, lead with the still-to-do classics.
			return [...tasks].sort((a, b) => {
				const ad = completed[a.id] ? 1 : 0
				const bd = completed[b.id] ? 1 : 0
				return ad - bd || a.id - b.id
			})
		}
		return [...tasks].sort((a, b) => {
			const ad = completed[a.id] ? 1 : 0
			const bd = completed[b.id] ? 1 : 0
			if (ad !== bd) return ad - bd
			return distanceMeters(userPosition, a) - distanceMeters(userPosition, b)
		})
	}, [tasks, completed, userPosition])

	const todo = sorted.filter(t => !completed[t.id])
	const visited = sorted.filter(t => completed[t.id])
	const next = todo.slice(0, 6)

	return (
		<div className="screen explore-screen">
			<header className="screen-header">
				{/* <span className="eyebrow">Live exploration · Portsmouth</span> */}
				<h2>Today's challenges</h2>
				<p className="screen-sub">
					{userPosition
						? "Sorted by what's nearest to you right now."
						: geoStatus === 'denied'
							? 'Enable location to see distances and proximity hints.'
							: "Waiting for your location to sort by what's closest…"}
				</p>
			</header>

			<section className="explore-section">
				<div className="section-row">
					<h3>Up next</h3>
					<span className="section-count">{todo.length} to go</span>
				</div>
				<div className="card-feed">
					{next.length === 0 && (
						<div className="empty-card">
							🎉 You've ticked off every challenge. Champion of Pompey!
						</div>
					)}
					{next.map(task => (
						<TaskCard
							key={task.id}
							task={task}
							done={false}
							allTasks={tasks}
							completed={completed}
							userPosition={userPosition}
							onOpen={onOpen}
						/>
					))}
				</div>
			</section>

			{visited.length > 0 && (
				<section className="explore-section">
					<div className="section-row">
						<h3>Memories</h3>
						<span className="section-count">{visited.length} visited</span>
					</div>
					<div className="memory-strip">
						{visited.slice(0, 8).map(task => (
							<button
								key={task.id}
								type="button"
								className="memory-chip"
								onClick={() => onOpen(task.id)}
							>
								<span className="memory-chip-tick" aria-hidden="true">
									✓
								</span>
								<span className="memory-chip-title">{task.title}</span>
								{userPosition && (
									<span className="memory-chip-dist">
										{formatDistance(distanceMeters(userPosition, task))}
									</span>
								)}
							</button>
						))}
					</div>
				</section>
			)}
		</div>
	)
}
