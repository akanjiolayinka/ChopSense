// Simple titled container used to break the profile page into clear blocks.
export default function ProfileSection({ title, action, children }) {
  return (
    <section className="card-base">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-cream">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
