type Props = {
  notes: string
  onUpdate: (s: string) => void
}

export default function Notes({ notes, onUpdate }: Props) {
  return (
    <div className="notes-page">
      <div className="page-header">
        <h1 className="page-title">Notes</h1>
        <p className="page-subtitle">Your personal R2I scratch pad — saved locally</p>
      </div>
      <textarea
        className="notes-textarea"
        placeholder="Jot down anything: questions to ask, contacts to follow up, neighborhood pros/cons, school research, budget figures..."
        value={notes}
        onChange={e => onUpdate(e.target.value)}
        spellCheck
      />
      <p className="notes-hint">
        {notes.length > 0 ? `${notes.length} characters · auto-saved` : 'Start typing...'}
      </p>
    </div>
  )
}
