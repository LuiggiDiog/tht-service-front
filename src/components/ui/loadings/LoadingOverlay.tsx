import LoadingSection from './LoadingSection';

export default function LoadingOverlay() {
  return (
    <div className="bg-slate-900 data-[state=open]:animate-overlayShow fixed inset-0 opacity-70 z-30">
      <LoadingSection />
    </div>
  );
}
